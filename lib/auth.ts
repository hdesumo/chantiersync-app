// lib/auth.ts
import { getSessionToken, setSessionToken, clearSessionToken } from "@/lib/cookies.server";
import { apiFetch, serverApiFetch } from "@/lib/api";
import type { User } from "@/types/user";

// -------------------
// LOGIN
// -------------------
export interface LoginPayload {
  email?: string;
  password?: string;
  full_mobile?: string;
  pin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(payload: LoginPayload): Promise<User> {
  const res = await apiFetch<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.token) {
    await setSessionToken(res.token);
  }

  return res.user;
}

// -------------------
// REGISTER
// -------------------
export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const res = await apiFetch<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.token) {
    await setSessionToken(res.token);
  }

  return res.user;
}

// -------------------
// LOGOUT
// -------------------
export async function logout(): Promise<void> {
  await clearSessionToken();
}

// -------------------
// SESSION
// -------------------
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await serverApiFetch<User>("/me");
  } catch {
    return null;
  }
}
