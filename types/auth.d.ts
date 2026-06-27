// Auth and user types shared across the entire app

export type UserRole = "admin" | "user";

export interface User {
  id:        string;
  name:      string;
  email:     string;
  role:      UserRole;
  createdAt: string;
}

export interface AuthSession {
  user:      User;
  token:     string;
  expiresAt: string;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface RegisterCredentials {
  name:            string;
  email:           string;
  password:        string;
  confirmPassword: string;
}
