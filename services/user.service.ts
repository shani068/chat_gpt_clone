// User CRUD API calls — list, get by ID, update, and delete
import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { User } from "@/types/auth";

interface UpdateUserPayload {
  name?:  string;
  email?: string;
}

export const userService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const res = await api.get<PaginatedResponse<User>>("/users", {
      params: { page, pageSize },
    });
    return res.data;
  },

  async getById(id: string): Promise<User> {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
