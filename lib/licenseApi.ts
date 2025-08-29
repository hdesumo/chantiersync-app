// lib/licenseApi.ts
import { apiFetch } from "@/lib/api";

export interface License {
  id: string;
  key: string;
  status: "active" | "inactive";
  enterpriseId: string;
}

export async function getLicenses(): Promise<License[]> {
  return apiFetch<License[]>("/licenses");
}

export async function listLicenses(): Promise<License[]> {
  return apiFetch<License[]>("/licenses");
}

export async function createLicense(payload: Partial<License>): Promise<License> {
  return apiFetch<License>("/licenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteLicense(id: string): Promise<void> {
  return apiFetch(`/licenses/${id}`, { method: "DELETE" });
}
