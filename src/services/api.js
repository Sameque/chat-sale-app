import axios from "axios";

const API_URL = "https://chat-sale-api.vercel.app";

const api = axios.create({
  baseURL: API_URL, 
});

export const register = (username, password) =>
  api.post("/auth/register", { username, password });

export const login = (username, password) =>
  api.post("/auth/login", { username, password });
  
export default api;
