// lib/licenseApi.ts

// Définition du type License
export interface License {
  id: string;
  key: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Fonction pour récupérer les licenses
export async function getLicenses(): Promise<License[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const res = await fetch(`${baseUrl}/licenses`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur récupération licenses: ${res.status}`);
  }

  return res.json() as Promise<License[]>;
}
