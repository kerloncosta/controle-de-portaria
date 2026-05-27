import axios from "axios";

export const api = axios.create({
  baseURL: "https://undergrad-sheep-progress.ngrok-free.dev",
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});