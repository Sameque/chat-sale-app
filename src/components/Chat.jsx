import { useEffect, useState, useRef } from "react";
import { getUsers } from "../services/api";
import UserList from "./UserList";
import Message from "./Message";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@supabase/supabase-js";

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);

  //Pegando usuário e id do token
  useEffect(() => {
    try {
      const decoded = jwtDecode(token);

      if (decoded?.username) {
        setUsername(decoded.username);
      }

      if (decoded?.id) {
        setUserId(decoded.id);
      }

    } catch (err) {
      console.error("Erro ao decodificar token:", err);
    }
  }, [token]);

  // Carregar histórico
  useEffect(() => {
    if (!userId || !receiver) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages_chat")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };

    fetchMessages();
  }, [userId, receiver]);

  // Realtime subscription
  useEffect(() => {

    const decoded = jwtDecode(token);

    if (decoded?.username) {
      setUsername(decoded.username);
    }

    if (decoded?.id) {
      setUserId(decoded.id);
    }

    if (!userId || !receiver) return;

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
            (message.sender_id === userId &&
              message.receiver_id === receiver.id) ||
            (message.sender_id === receiver.id &&
              message.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // }, [token]);
  }, [userId, receiver]);

  //Buscando usuários
  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsers(token);
      setUsers(res.data);
    };
    loadUsers();
  },[]);

  useEffect(() => {

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await supabase.from("messages_chat").insert({
        sender_id: userId,
        receiver_id: receiver.id,
        content: text,
      });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }

    setText("");
  };

  return (
    <div className="flex h-screen">
      <UserList users={users} username={username} onSelect={setReceiver} />

      <div className="flex flex-col flex-1">
        <div className="p-4 border-b bg-gray-200 font-bold">
          {receiver ? `Conversando com ${receiver.username}` : "Selecione um usuário"}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} userId={userId} messagesEndRef={messagesEndRef} />
          ))}
        </div>

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
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
