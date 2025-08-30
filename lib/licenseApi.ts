// lib/licenseApi.ts
import { clientGet, clientPost } from "./clientApi";

export async function getLicenses() {
  return clientGet("/licenses");
}

export async function createLicense(data: any) {
  return clientPost("/licenses", data);
}
