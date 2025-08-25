import { appNavigator } from "../utils/appNavigator";
import axios from "axios";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const forceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (appNavigator.navigate) {
    appNavigator.navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const URL = import.meta.env.VITE_BACKEND_URL;
const apiClient = axios.create({
  baseURL: URL,
  withCredentials: false,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config as InternalAxiosRequestConfig;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (!originalRequest) return Promise.reject(error);

    let path = originalRequest.url ?? "";
    try {
      path = new URL(originalRequest.url ?? "", URL).pathname;
    } catch {}

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      path !== "/auth/login" &&
      path !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            processQueue(error, null);
            forceLogout();
            return Promise.reject(error);
          }

          // use relative path here
          const refreshResponse: AxiosResponse<AuthTokens> =
            await apiClient.post("/auth/refresh-token", { refreshToken });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } catch (refreshErr: any) {
          processQueue(refreshErr as AxiosError, null);
          forceLogout();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token as string}`;
          }
          return apiClient(originalRequest);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
