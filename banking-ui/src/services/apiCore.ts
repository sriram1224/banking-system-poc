import axios from "axios";

export const apiCore = axios.create({
  baseURL: "https://system2-corebank.onrender.com",
});
