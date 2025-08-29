import { useEffect, useState, useRef } from "react";
import UserList from "./UserList";
import Message from "./Message";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@supabase/supabase-js";

import { Menu } from "lucide-react";

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);
console.log(import.meta.env);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const messagesEndRef = useRef(null);
  const [showUsers, setShowUsers] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUsers(false);
      }
    }

    if (showUsers) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUsers, setShowUsers]);

  //Pegando usuário e id pelo token
  useEffect(() => {
    try {
      const user = jwtDecode(token);
      setCurrentUser(user);

    } catch (err) {
      console.error("Erro ao decodificar token:", err);
    }
  }, [token]);

  // Realtime subscription
  useEffect(() => {

    if (!currentUser.id || !receiver) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages_chat")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages_chat",
        },
        (payload) => {
          const message = payload.new;

          // só adiciona mensagens relevantes ao chat atual
          if (
            (message.sender_id === currentUser.id &&
              message.receiver_id === receiver.id) ||
            (message.sender_id === receiver.id &&
              message.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, receiver]);

  //Buscando usuários
  useEffect(() => {
    const fetchUsers = async () => {
      //TODO: filtrar usuário logado      
      const { data, error } = await supabase.from("users").select("*");
      const users = data.filter((u) => u.id !== currentUser.id);

      if (!error) setUsers(users);
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await supabase.from("messages_chat").insert({
        sender_id: currentUser.id,
        receiver_id: receiver.id,
        content: text,
      });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }

    setText("");
  };

  return (
    <div className="h-screen flex">
      {/* LISTA DE USUÁRIOS */}
      <aside
        ref={menuRef}
        className={`
            fixed lg:static inset-y-0 left-0 w-64 bg-white border-r z-20 
            transform transition-transform duration-300
            ${showUsers ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
        <div className="p-4 font-bold border-b">Usuários</div>
        <UserList users={users} username={currentUser.username} onSelect={setReceiver} setShowUsers={setShowUsers} />
      </aside>

      {/* ÁREA DO CHAT */}
      <div className="flex-1 flex flex-col relative">
        {/* HEADER FIXO */}
        <header
          className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow  flex items-center justify-between p-4">
          <button onClick={() => setShowUsers(!showUsers)}>
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="font-bold">
            {receiver ? `Conversando com ${receiver.username}` : "Chat"}
          </h1>
          <div />
        </header>

        {/* MENSAGENS ROLÁVEIS */}
        <main className="flex-1 overflow-y-auto px-4 pt-16 pb-20">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <Message key={idx} msg={msg} userId={currentUser.id} messagesEndRef={messagesEndRef} />
            ))}
          </div>
        </main>

        {/* FOOTER FIXO */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t shadow">
          <div className="card">
            {receiver && (
              <div className="flex p-2 bg-white border-t">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded mr-2"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded">
                  Enviar
                </button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
