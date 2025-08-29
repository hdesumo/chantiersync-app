// lib/cookies.ts
import Cookies from "js-cookie";

const COOKIE_NAME = "cs_session";

export const setSessionCookie = (token: string) => {
  Cookies.set(COOKIE_NAME, token, { expires: 1 }); // expire en 1 jour
};

export const getSessionCookie = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};

export const clearSessionCookie = () => {
  Cookies.remove(COOKIE_NAME);
};
