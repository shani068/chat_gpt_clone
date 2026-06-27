// Mutation hooks for POST / PUT / PATCH / DELETE / file-upload operations
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosProgressEvent } from "axios";
import { api } from "@/lib/api";
import { resolveError } from "@/utils/resolve-error";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseApiOptions<T> {
  mutationKey?:    unknown[];
  invalidateKeys?: unknown[][];
  onSuccess?:      (data: T) => void;
  onError?:        (error: string) => void;
}

interface UploadConfig {
  fieldName?:      string;
  additionalData?: Record<string, string>;
  onProgress?:     (percent: number) => void;
}

// ── Shared invalidation helper ────────────────────────────────────────────────

function invalidateAll(
  queryClient: ReturnType<typeof useQueryClient>,
  keys?: unknown[][]
) {
  keys?.forEach((key) => {
    void queryClient.invalidateQueries({ queryKey: key });
  });
}

// ── POST ──────────────────────────────────────────────────────────────────────

export function usePost<TData = unknown, TBody = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TBody>({
    mutationKey: options.mutationKey,
    mutationFn: async (body: TBody) => {
      const res = await api.post<TData>(url, body);
      return res.data;
    },
    onSuccess: (data) => {
      invalidateAll(queryClient, options.invalidateKeys);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(resolveError(err));
    },
  });
}

// ── PUT ───────────────────────────────────────────────────────────────────────

export function usePut<TData = unknown, TBody = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TBody>({
    mutationKey: options.mutationKey,
    mutationFn: async (body: TBody) => {
      const res = await api.put<TData>(url, body);
      return res.data;
    },
    onSuccess: (data) => {
      invalidateAll(queryClient, options.invalidateKeys);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(resolveError(err));
    },
  });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export function usePatch<TData = unknown, TBody = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TBody>({
    mutationKey: options.mutationKey,
    mutationFn: async (body: TBody) => {
      const res = await api.patch<TData>(url, body);
      return res.data;
    },
    onSuccess: (data) => {
      invalidateAll(queryClient, options.invalidateKeys);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(resolveError(err));
    },
  });
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export function useDelete<TData = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, string | void>({
    mutationKey: options.mutationKey,
    mutationFn: async (id) => {
      const endpoint = id ? `${url}/${id}` : url;
      const res = await api.delete<TData>(endpoint);
      return res.data;
    },
    onSuccess: (data) => {
      invalidateAll(queryClient, options.invalidateKeys);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(resolveError(err));
    },
  });
}

// ── UPLOAD ────────────────────────────────────────────────────────────────────

interface UploadVariables {
  file:    File | File[];
  config?: UploadConfig;
}

export function useUpload<TData = unknown>(
  url: string,
  options: UseApiOptions<TData> = {}
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, UploadVariables>({
    mutationKey: options.mutationKey,
    mutationFn: async ({ file, config = {} }) => {
      const { fieldName = "file", additionalData = {}, onProgress } = config;

      const formData = new FormData();

      if (Array.isArray(file)) {
        file.forEach((f) => formData.append(fieldName, f));
      } else {
        formData.append(fieldName, file);
      }

      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await api.post<TData>(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (onProgress && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      invalidateAll(queryClient, options.invalidateKeys);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(resolveError(err));
    },
  });
}
