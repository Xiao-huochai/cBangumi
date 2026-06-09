import axios, { type AxiosRequestConfig } from "axios";

import type { ApiResult } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

function unwrapResult<T>(result: ApiResult<T>) {
  if (result.code !== 200 && result.code !== 201) {
    throw new ApiError(result.code, result.message);
  }

  return result.data;
}

async function request<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<ApiResult<T>>(config);

  return unwrapResult(response.data);
}

export const api = {
  get<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: "GET",
      url,
      params,
    });
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: "POST",
      url,
      data,
    });
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: "PUT",
      url,
      data,
    });
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: "PATCH",
      url,
      data,
    });
  },

  delete<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: "DELETE",
      url,
      params,
    });
  },
};
