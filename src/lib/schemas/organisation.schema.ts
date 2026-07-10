// lib/schemas/organisation.schema.ts
import { z } from "zod";
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

export const organisationItemSchema = z.object({
  organisation: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  hubspotId: z.string().optional(),
  industry: z
    .enum(["space", "marketing", "climate", "technology", "education", "research", "other"])
    .optional(),
  category: z.string().optional(),
  type: z
    .enum(["partner", "client", "employer", "publisher", "community", "institution", "other"])
    .optional(),
  logo: z.string().optional(),
  featured: z.boolean().default(false),
});

export type OrganisationItem = z.infer<typeof organisationItemSchema>;
