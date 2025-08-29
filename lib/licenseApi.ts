// lib/licenseApi.ts
import { clientApiFetch } from "./api";

export async function getLicenses() {
  return clientApiFetch("/licenses");
}

export async function createLicense(data: any) {
  return clientApiFetch("/licenses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteLicense(id: string) {
  return clientApiFetch(`/licenses/${id}`, { method: "DELETE" });
}
