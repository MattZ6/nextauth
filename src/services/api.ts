import axios, { AxiosError, HeadersDefaults, AxiosRequestHeaders, AxiosInstance } from 'axios';
import { setCookie, parseCookies } from 'nookies';
import { signOut } from '../contexts/AuthContext';

type FailedRequest = {
  onSuccess: (updatedAccessToken: string) => void;
  onFailure: (error: AxiosError) => void;
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

export const ACCESS_TOKEN_KEY = 'nextauth.token';
export const REFRESH_TOKEN_KEY = 'nextauth.refresh';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies[ACCESS_TOKEN_KEY]}`,
  }
});

export type Authentication = {
  token: string;
  refreshToken: string;
  permissions: string[];
  roles: string[];
}

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const originalConfig = error.config;

        const refreshToken = cookies[REFRESH_TOKEN_KEY];

        if (!isRefreshing) {
          isRefreshing = true;

          api.post<Authentication>('/refresh', { refreshToken })
            .then(response => {
              setAuthCookies(api, response.data);

              failedRequestsQueue.forEach(request => {
                request.onSuccess(response.data.token);
              });

              failedRequestsQueue = [];
            })
            .catch(error => {
              failedRequestsQueue.forEach(request => {
                request.onFailure(error);
              });

              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (updatedAccessToken: string) => {
              const headers =  originalConfig.headers ?? {};

              headers['Authorization'] = `Bearer ${updatedAccessToken}`;

              originalConfig.headers = headers;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      } else {
        signOut();
      }

      return Promise.reject(error);
    }
  }
);

export function setAuthCookies(instance: AxiosInstance, data: Authentication) {
  setCookie(undefined, ACCESS_TOKEN_KEY, data.token, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 👈 30 days
  });

  setCookie(undefined, REFRESH_TOKEN_KEY, data.refreshToken, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 👈 30 days
  });

  (api.defaults.headers as HeadersDefaults & AxiosRequestHeaders)['Authorization'] = `Bearer ${data.token}`;

}
