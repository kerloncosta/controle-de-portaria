import axios from 'axios';

const envMode = import.meta.env.VITE_ENV_MODE || 'local';

const baseURL = envMode === 'ngrok' 
  ? import.meta.env.VITE_API_URL_NGROK 
  : import.meta.env.VITE_API_URL_LOCAL;

const headers: Record<string, string> = {};

  if (envMode === 'ngrok') {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

export const api = axios.create({
  baseURL,
  headers,
});
