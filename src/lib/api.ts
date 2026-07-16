import { z } from "zod";

// --- Schemas ---
import { awardItemSchema, type AwardItem } from "@/lib/schemas/award.schema";
import { certificationItemSchema, type CertificationItem } from "@/lib/schemas/certification.schema";
import { educationItemSchema, type EducationItem } from "@/lib/schemas/education.schema";
import { experienceItemSchema, type ExperienceItem } from "@/lib/schemas/experience.schema";
import { languageItemSchema, type LanguageItem } from "@/lib/schemas/languages.schema";
import { organisationItemSchema, type OrganisationItem } from "@/lib/schemas/organisation.schema";
import { volunteeringItemSchema, type VolunteeringItem } from "@/lib/schemas/volunteering.schema";
import { projectSchema, type ProjectItem } from "@/lib/schemas/project.schema";

// --- Constants ---
const API_BASE = "https://api.rjmlaird.co.uk/api";
const MANIFEST_URL = "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev/manifest.json";

// --- Utilities ---
async function fetchJson<T>(url: string, isFullUrl = false): Promise<T> {
  const fullUrl = isFullUrl ? url : `${API_BASE}/${url}`;
  const res = await fetch(fullUrl, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") return Object.values(value as Record<string, T>);
  return [];
}

// --- Manifest / CDN Logic ---
export const manifestEntrySchema = z.object({
  id: z.string(),
  key: z.string(),
});

export type ManifestEntry = z.infer<typeof manifestEntrySchema>;

export async function getDocuments(): Promise<ManifestEntry[]> {
  try {
    const data = await fetchJson<unknown>(MANIFEST_URL, true);
    return z.array(manifestEntrySchema).parse(data);
  } catch (e) {
    console.error("[API] Failed to fetch manifest:", e);
    return [];
  }
}

// --- Profile & Content Schemas ---
export const profileSchema = z.object({
  name: z.string().optional(),
  preferredName: z.string().optional(),
  pronouns: z.string().optional(),
  headline: z.string().optional(),
  biography: z.array(z.string()).default([]),
  location: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  avatar: z.string().optional(),
  role: z.string().optional(),
  credentials: z.string().optional(),
  summary: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  portfolioLinks: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  contact: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
});

export type Profile = z.infer<typeof profileSchema>;

export const membershipItemSchema = z.object({
  organisation: z.string(),
  organisationSlug: z.string(),
  role: z.string(),
  type: z.string(),
  description: z.string().optional(),
});

export const membershipGroupSchema = z.object({
  title: z.string(),
  items: z.array(membershipItemSchema),
});

export const membershipsResponseSchema = z.object({
  memberships: z.array(membershipGroupSchema),
});

export type MembershipGroup = z.infer<typeof membershipGroupSchema>;

// --- Data Fetchers ---
export async function getExperience() { return z.array(experienceItemSchema).parse(await fetchJson<unknown>("experience")); }
export async function getEducation() { return z.array(educationItemSchema).parse(await fetchJson<unknown>("education")); }
export async function getLanguages() { return z.array(languageItemSchema).parse(await fetchJson<unknown>("languages")); }
export async function getOrganisations() { return z.array(organisationItemSchema).parse(await fetchJson<unknown>("organisations")); }
export async function getVolunteering() { return z.array(volunteeringItemSchema).parse(await fetchJson<unknown>("volunteering")); }
export async function getProfile() { return profileSchema.parse(await fetchJson<unknown>("profile")); }
export async function getProjects() { return z.array(projectSchema).parse(await fetchJson<unknown>("portfolio/projects")); }

export async function getCertifications(): Promise<CertificationItem[]> {
  const data = await fetchJson<unknown>("certifications");
  const root = (data && typeof data === "object" && "certifications" in data) ? (data as any).certifications : data;
  return z.array(certificationItemSchema).parse(asArray<unknown>(root));
}

export async function getMemberships(): Promise<MembershipGroup[]> {
  const data = await fetchJson<unknown>("memberships");
  return membershipsResponseSchema.parse(data).memberships;
}

export async function getAwards(): Promise<AwardItem[]> {
  const data = await fetchJson<unknown>("awards");
  const root = (data && typeof data === "object" && "awards" in data) ? (data as any).awards : data;
  return z.array(awardItemSchema).parse(asArray<unknown>(root));
}

// --- API Export ---
export const api = {
  getDocuments,
  getExperience,
  getEducation,
  getCertifications,
  getMemberships,
  getAwards,
  getLanguages,
  getProfile,
  getOrganisations,
  getVolunteering,
  getProjects,
};

export default api;