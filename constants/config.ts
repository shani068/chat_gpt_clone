// App-wide static configuration values
export const APP_NAME    = "MyApp";
export const APP_VERSION = "0.1.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const PAGINATION = {
  DEFAULT_PAGE:      1,
  DEFAULT_PAGE_SIZE: 10,
} as const;

export const TOKEN_KEY = "auth_token";
