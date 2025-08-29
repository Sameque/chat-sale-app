import { useState } from "react";
import { login, register } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      sessionStorage.setItem("chat-app-token", res.data.token);
      onLogin(res.data.token, username);
    } catch (err) {
      alert("Erro ao logar");
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
      alert("Registrado com sucesso! Agora faça login.");
    } catch {
      alert("Erro ao registrar");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Chat Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-white p-2 rounded mb-2"
        >
          Entrar
        </button>
        <button
          onClick={handleRegister}
          className="w-full bg-gray-500 text-white p-2 rounded"
        >
          Registrar
        </button>
      </div>
    </div>
  );
}
