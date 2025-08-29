// lib/licenseApi.ts
import api from "../api";

export interface License {
  id?: string;
  enterprise_id: string;
  enterprise?: { id: string; name: string };
  type: string;
  start_date: string;
  end_date: string;
  max_users: number;
  status: string;
}

export async function getLicenses(token: string): Promise<License[]> {
  const res = await api.get("/licenses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createLicense(token: string, data: License): Promise<License> {
  const res = await api.post("/licenses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateLicense(token: string, id: string, data: License): Promise<License> {
  const res = await api.put(`/licenses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteLicense(token: string, id: string): Promise<void> {
  await api.delete(`/licenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
