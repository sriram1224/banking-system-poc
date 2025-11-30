import axios from "axios";

export const apiCore = axios.create({
  baseURL: import.meta.env.VITE_CORE_URL || "http://localhost:8082",
});
