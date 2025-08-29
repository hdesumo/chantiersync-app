// types/user.ts

export type UserRole = "SUPERADMIN" | "ADMIN" | "AGENT" | "USER";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  enterpriseId?: string;   // si l'utilisateur appartient à une entreprise
  createdAt: string;
  updatedAt: string;
}
