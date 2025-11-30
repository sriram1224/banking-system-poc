import axios from "axios";

export const apiGateway = axios.create({
  baseURL:
    import.meta.env.VITE_GATEWAY_URL ||
    "https://banking-system-poc.onrender.com",
});
