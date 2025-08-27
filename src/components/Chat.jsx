import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
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
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);

  //PEgando usuário e id do token
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
  // }, [user, contact]);

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
              // (message.sender_id === user.id &&
              // message.receiver_id === receiver.id) ||
              message.receiver_id === receiver.id) ||
            (message.sender_id === receiver.id &&
              // (message.sender_id === contact.id &&
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

  //Conexão com o socket
  // useEffect(() => {
  //   if (!username) return;

  //   const newSocket = io("http://localhost:3000", {
  //     auth: { token },
  //   });
  //   setSocket(newSocket);

  //   newSocket.on("privateMessage", (msg) => {

  //     console.log(`sender_id:`, msg.sender_id);
  //     console.log(`receiver_id:`, msg.receiver_id);
  //     console.log(`username`, username);
  //     console.log(`receiver`, receiver.id);
  //     console.log(`receiver`, receiver.username);

  //     // console.log("Mensagem recebida:", msg);

  //     if (
  //       (msg.sender_id === userId && msg.receiver_id === receiver.id) ||
  //       (msg.sender_id === receiver.id && msg.receiver_id === userId)
  //     ) {
  //       setMessages((prev) => [...prev, msg]);
  //     }
  //   });

  //   return () => newSocket.disconnect();
  // }, [token, receiver, username]);

  //Buscando usuários
  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsers(token);
      setUsers(res.data);
    };
    loadUsers();
  }, [token]);

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

  // const sendMessage = () => {
  //   // console.log(`Enviando mensagem: ${text} para`, receiver);

  //   if (text.trim() !== "" && receiver) {

  //     const msg = {
  //       receiver: receiver.username,
  //       sender: username,
  //       senderId: userId,
  //       receiverId: receiver.id,
  //       content: text,
  //       createdAt: new Date().toISOString(),
  //     };

  //     // console.log("Mensagem a ser enviada:", msg);

  //     socket.emit("privateMessage", msg);
  //     setText("");
  //   }
  // };

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
