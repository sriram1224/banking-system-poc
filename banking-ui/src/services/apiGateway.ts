import axios from "axios";

export const apiGateway = axios.create({
  baseURL: "http://localhost:8081",
});
