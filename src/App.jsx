import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { env } from 'meta';

export default function App() {
  
  console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_KEY);
  console.log("Environment:", env);
  
  
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
