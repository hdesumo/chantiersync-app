// lib/licenseApi.ts
import clientApi from "@/lib/api"; // ✅ corrige l'import

// Récupérer toutes les licences
export async function getLicenses() {
  const res = await clientApi.get("/licenses");
  return res.data;
}

// Créer une nouvelle licence
export async function createLicense(payload: any) {
  const res = await clientApi.post("/licenses", payload);
  return res.data;
}

// Supprimer une licence
export async function deleteLicense(id: string) {
  const res = await clientApi.delete(`/licenses/${id}`);
  return res.data;
}

// Mettre à jour une licence
export async function updateLicense(id: string, payload: any) {
  const res = await clientApi.put(`/licenses/${id}`, payload);
  return res.data;
}
