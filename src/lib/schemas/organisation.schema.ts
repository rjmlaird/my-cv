// lib/schemas/organisation.schema.ts
import type { Slug } from "./base.schema";

export type OrganisationType =
  | "partner"
  | "client"
  | "employer"
  | "publisher"
  | "community"
  | "institution"
  | "other";

export type OrganisationIndustry =
  | "space"
  | "marketing"
  | "climate"
  | "technology"
  | "education"
  | "research"
  | "other";

export type Organisation = {
  organisation: string;
  slug: Slug;
  description?: string;
  url?: string;
  hubspotId?: string;
  industry?: OrganisationIndustry;
  category?: string;
  type?: OrganisationType;
  logo?: string;
  featured?: boolean;
};
