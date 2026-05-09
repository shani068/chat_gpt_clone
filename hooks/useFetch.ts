import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { resolveError } from "@/lib/resolve-error";
import type { AxiosRequestConfig } from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UseFetchOptions<T> {
  enabled?:         boolean;
  staleTime?:       number;
  gcTime?:          number;
  refetchInterval?: number | false;
  initialData?:     T;
  params?:          Record<string, string | number | boolean>;
  config?:          AxiosRequestConfig;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFetch<T = unknown>(
  url:      string | null,
  queryKey: unknown[],
  options:  UseFetchOptions<T> = {}
) {
  const queryClient = useQueryClient();

  const {
    enabled         = true,
    staleTime       = 60 * 1000,
    gcTime          = 5 * 60 * 1000,
    refetchInterval = false,
    initialData,
    params,
    config,
  } = options;

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      const res = await api.get<T>(url!, { ...config, params, signal });
      return res.data;
    },
    enabled:         !!url && enabled,
    staleTime,
    gcTime,
    refetchInterval,
    initialData,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey });
  };

  return {
    ...query,
    error:     query.isError ? resolveError(query.error) : null,
    invalidate,
  };
}
