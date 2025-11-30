import axios from "axios";

export const apiGateway = axios.create({
  baseURL: "https://banking-system-poc.onrender.com/",
});
