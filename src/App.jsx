import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("chat-app-token") || null);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
  };

  return token ? (
    <Chat token={token} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
