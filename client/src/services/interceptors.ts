import axios from "axios";

import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores/authStore";
import KeycloakService from "./keycloak";
import { useDialogStore } from "../stores/appStore";
import { toast } from "vue-sonner";
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
  const dialogStore = useDialogStore();

  if (authStore.authenticated) {
    authStore.refreshUserToken();
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
    timeout: 100000,
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
    async (error) => {
      let errResponse = "";
      try {
        errResponse = String(error.response?.data);
      } catch (e) {
        console.error(e);
        errResponse = await error.response.data.text();
      }

      if (errResponse === "Token expired") {
        toast.dismiss();
        dialogStore.openDialog(
          "User timed-out",
          "Please confirm if you are still using the generator, and retry your action."
        );
      } else {
        console.log("From error file", error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
