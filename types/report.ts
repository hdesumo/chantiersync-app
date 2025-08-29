// types/report.ts

export type ReportCategory = "incident" | "progress" | "quality" | "safety";
export type ReportPriority = "low" | "medium" | "high";

export interface Report {
  id: string;
  siteId: string;        // lien avec le chantier (Site)
  title: string;
  description: string;
  category: ReportCategory;
  priority: ReportPriority;
  location?: string;     // GPS ou adresse (optionnel)
  createdBy: string;     // id de l’utilisateur qui a créé le rapport
  createdAt: string;
  updatedAt: string;
}
