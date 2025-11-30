import axios from "axios";

export const apiCore = axios.create({
  baseURL: "http://localhost:8082",
});
