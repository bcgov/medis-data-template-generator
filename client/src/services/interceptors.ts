import axios from "axios";

import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores/authStore";
import KeycloakService from "./keycloak";

// Axios serializes query params and encodes spaces with '+'
// Some external APIs may require spaces to be encoded with '%20 instead
// const paramRegex = /\+/g;
// const paramsSerializer = {
//   encode: (param: string) =>
//     encodeURIComponent(param).replace(paramRegex, "%20"),
// };

/**
 * @function apiAxios
 * Returns an Axios instance for the application API
 * @param {AxiosRequestConfig} options Axios request config options
 * @returns {AxiosInstance} An axios instance
 */
export async function apiAxios(
  options: AxiosRequestConfig = {}
): Promise<AxiosInstance> {
  const authStore = useAuthStore();

  if (authStore.authenticated) {
    await KeycloakService.CallInitStore(authStore, false);
    const token = await KeycloakService.CallGetToken();

    options.headers = {
      Authorization: `Bearer ${token}`,
    };
  } else {
    throw new Error("User is not authenticated");
  }

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
    ...options,
  });

  instance.interceptors.request.use(
    async (cfg: InternalAxiosRequestConfig) => {
      return Promise.resolve(cfg);
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const errResponse = String(error.response?.data);

      if (errResponse === "Token expired") {
        authStore.login();
      } else {
        console.log(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
