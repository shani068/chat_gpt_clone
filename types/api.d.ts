// Shared API response shapes used across all service calls

export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface ApiError {
  message:   string;
  statusCode: number;
  errors?:   Record<string, string[]>;
}
