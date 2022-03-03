import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const ACCESS_TOKEN_KEY = 'nextauth.token';
export const REFRESH_TOKEN_KEY = 'nextauth.refresh';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies[ACCESS_TOKEN_KEY]}`,
  }
});
