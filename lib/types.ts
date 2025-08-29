// lib/types.ts

// Utilisateur générique
export type User = {
  id: string;
  email: string;
  name?: string;
  role: "SUPERADMIN" | "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
};

// Entreprise
export type Enterprise = {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  leaders?: string[];
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// Licence
export type License = {
  id: string;
  key: string;
  status: "active" | "inactive" | "expired";
  enterpriseId: string;
  createdAt: string;
  updatedAt: string;
};

// Site
export type Site = {
  id: string;
  name: string;
  location?: string;
  qrCodeUrl?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

// Rapport
export type Report = {
  id: string;
  siteId: string;
  title: string;
  description: string;
  category: "incident" | "progress" | "quality" | "safety";
  priority: "low" | "medium" | "high";
  location?: string;
  createdAt: string;
  updatedAt: string;
};

// Locataire (Tenant)
export type Tenant = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
