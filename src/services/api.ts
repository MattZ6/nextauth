import axios, { AxiosError } from 'axios';

import { getAuthCookies, setAuthCookies } from '../utils/authCookies';

import { signOut } from '../contexts/AuthContext';

import { AuthTokenError } from './errors/AuthTokenError';
import { RefreshTokenService } from './user';

type FailedRequest = {
  onSuccess: (updatedAccessToken: string) => void;
  onFailure: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

export function setupApiClient(context?: any) {
  let cookies = getAuthCookies(context);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
  });

  if (cookies.token) {
    setAuthenticationHeader(cookies.token);
  }

  api.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (error.response?.data?.code === 'token.expired') {
          cookies = getAuthCookies(context);

          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            RefreshTokenService.refreshToken({ refreshToken: cookies.refreshToken! }, {
              instance: api
            })
              .then(response => {
                setAuthCookies(response.data, context);

                setAuthenticationHeader(response.data.token);

                failedRequestsQueue.forEach(request => request.onSuccess(response.data.token));
                failedRequestsQueue = [];
              })
              .catch((err: AxiosError) => {
                failedRequestsQueue.forEach(request => request.onFailure(err));
                failedRequestsQueue = [];

                if (typeof window !== 'undefined') {
                  signOut();
                } else {
                  return Promise.reject(new AuthTokenError());
                }
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
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }

      return Promise.reject(error);
    }
  );

  function setAuthenticationHeader(token: string) {
    (api.defaults.headers as any)['Authorization'] = `Bearer ${token}`;
  }

  return { api, setAuthenticationHeader };
}


