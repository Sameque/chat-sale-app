import axios from "axios";

const API_URL = "https://chat-sale-api-v2.vercel.app";

const api = axios.create({
  baseURL: API_URL, 
});

export const register = (username, password) =>
  api.post("/auth/register", { username, password });

export const login = (username, password) =>
  api.post("/auth/login", { username, password });

export const getUsers = async (token) =>
  api.get("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
export default api;
