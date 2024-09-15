import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getUserFromLocalStorage } from "./localStorage";

const MODE = import.meta.env.VITE_MODE;
const API_DEV = import.meta.env.VITE_API_DEV;
const API_PROD = import.meta.env.VITE_API_PROD;

export const api_url = MODE === "develop" ? API_DEV : API_PROD;

const customFetch = axios.create({
  baseURL: `${api_url}/api`,
});

customFetch.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const user = getUserFromLocalStorage();
    if (user) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default customFetch;
