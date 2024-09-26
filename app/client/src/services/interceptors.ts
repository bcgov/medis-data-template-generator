import axios from "axios";

import { ConfigService } from "./index";

import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// Axios serializes query params and encodes spaces with '+'
// Some external APIs may require spaces to be encoded with '%20 instead
const paramRegex = /\+/g;
const paramsSerializer = {
  encode: (param: string) =>
    encodeURIComponent(param).replace(paramRegex, "%20"),
};

/**
 * @function appAxios
 * Returns an Axios instance for the application API
 * @param {AxiosRequestConfig} options Axios request config options
 * @returns {AxiosInstance} An axios instance
 */
export function appAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL:
      window.location.origin + `/${new ConfigService().getConfig().apiPath}`,
    timeout: 10000,
    ...options,
  });

  instance.interceptors.request.use(
    async (cfg: InternalAxiosRequestConfig) => {
      //   const authService = new AuthService();
      //   const user = await authService.getUser();
      //   if (!!user && !user.expired) {
      //     cfg.headers.Authorization = `Bearer ${user.access_token}`;
      //   }
      return Promise.resolve(cfg);
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

export function apiAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
    ...options,
  });

  instance.interceptors.request.use(
    async (cfg: InternalAxiosRequestConfig) => {
      //   const authService = new AuthService();
      //   const user = await authService.getUser();
      //   if (!!user && !user.expired) {
      //     cfg.headers.Authorization = `Bearer ${user.access_token}`;
      //   }
      return Promise.resolve(cfg);
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}
