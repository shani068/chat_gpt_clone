// Central route map — import ROUTES instead of hardcoding path strings
export const ROUTES = {
  HOME:      "/",
  LOGIN:     "/login",
  REGISTER:  "/register",
  DASHBOARD: "/dashboard",
  SETTINGS:  "/settings",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
