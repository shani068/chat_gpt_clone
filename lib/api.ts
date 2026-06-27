// Axios instance — all HTTP calls go through this; 401 redirects to the login page
import axios from "axios";
import { ROUTES } from "@/constants/routes";

export const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);
