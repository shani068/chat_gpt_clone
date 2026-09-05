// Central route map — import ROUTES instead of hardcoding path strings
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHAT: "/chat",
  SETTINGS: "/settings",
} as const;

export const conversationRoute = (id: string) => `/chat/${id}` as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
