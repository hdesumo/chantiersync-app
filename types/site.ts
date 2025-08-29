// types/site.ts

export interface Site {
  id: string;
  name: string;
  location?: string;      // optionnel : ville, adresse...
  enterpriseId: string;   // lien avec l’entreprise
  createdAt: string;
  updatedAt: string;
}
