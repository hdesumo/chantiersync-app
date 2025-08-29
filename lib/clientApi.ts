// lib/clientApi.ts
import axios from "axios";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

export default clientApi;

// Helpers GET / DELETE
export async function clientGet(path: string) {
  const res = await clientApi.get(path);
  return res.data;
}

export async function clientDelete(path: string) {
  const res = await clientApi.delete(path);
  return res.data;
}
