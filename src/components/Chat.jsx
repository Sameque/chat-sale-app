import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getUsers } from "../services/api";
import UserList from "./UserList";
import Message from "./Message";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";

export default function Chat({ token, username: initialUsername }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [username, setUsername] = useState(initialUsername);

  // 🔑 Se username não vier, pega do token
  useEffect(() => {
    if (!initialUsername || initialUsername.trim() === "") {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.username) {
          setUsername(decoded.username);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, [initialUsername, token]);

  useEffect(() => {
    if (!username) return; // só conecta quando tiver username válido

    const newSocket = io("http://localhost:3000", {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("privateMessage", (msg) => {
      if (
        (msg.sender === username && msg.receiver === receiver) ||
        (msg.sender === receiver && msg.receiver === username)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => newSocket.disconnect();
  }, [token, receiver, username]);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await getUsers(token);
      setUsers(res.data);
    };
    loadUsers();
  }, [token]);

  const sendMessage = () => {
    if (text.trim() !== "" && receiver) {
      console.log(`Enviando mensagem: ${text} para ${receiver}`);

      const msg = {
        sender: username,
        receiver,
        text,
        created_at: new Date().toISOString(),
      };
      /*
            const message = {
              sender: socket.user.username,
              receiver,
                text,
                created_at: timestamp //: new Date(timestamp),
            };


      */
      console.log("Mensagem a ser enviada:", msg);

      socket.emit("privateMessage", msg);
      setText("");
    }
  };

  return (
    <div className="flex h-screen">
      <UserList users={users} onSelect={setReceiver} />

      <div className="flex flex-col flex-1">
        <div className="p-4 border-b bg-gray-200 font-bold">
          {receiver ? `Conversando com ${receiver}` : "Selecione um usuário"}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} username={username} />
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
