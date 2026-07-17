import { z } from "zod";
import { awardItemSchema } from "@/lib/schemas/award.schema";
import { certificationItemSchema } from "@/lib/schemas/certification.schema";
import { educationItemSchema } from "@/lib/schemas/education.schema";
import { experienceItemSchema } from "@/lib/schemas/experience.schema";
import { languageItemSchema } from "@/lib/schemas/languages.schema";
import { organisationItemSchema } from "@/lib/schemas/organisation.schema";
import { volunteeringItemSchema } from "@/lib/schemas/volunteering.schema";
import { projectSchema } from "@/lib/schemas/project.schema";
import { profileSchema } from "@/lib/schemas/profile.schema";
import { socialSchema } from "@/lib/schemas/social.schema";
// Fixed import based on compiler suggestion
import { membershipsSchema } from "@/lib/schemas/membership.schema";

export type Profile = z.infer<typeof profileSchema>;

const API_BASE = "https://api.rjmlaird.co.uk/api";
const MANIFEST_URL = "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev/manifest.json";

async function fetchJson<T>(url: string, isFullUrl = false): Promise<T | null> {
  try {
    const fullUrl = isFullUrl ? url : `${API_BASE}/${url}`;
    const res = await fetch(fullUrl, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<T>;
  } catch (e) {
    console.error(`[API] Failed to fetch ${url}:`, e);
    return null;
  }
}

async function safeParse<T>(url: string, schema: z.ZodType<T[]>): Promise<T[]> {
  const data = await fetchJson<unknown>(url);
  if (!data) return [];
  const result = schema.safeParse(data);
  return result.success ? result.data : [];
}

// --- Data Fetchers ---
export async function getDocuments() {
  const data = await fetchJson<unknown>(MANIFEST_URL, true);
  return Array.isArray(data) ? data : [];
}

export async function getExperience() { return safeParse("experience", z.array(experienceItemSchema)); }
export async function getEducation() { return safeParse("education", z.array(educationItemSchema)); }
export async function getLanguages() { return safeParse("languages", z.array(languageItemSchema)); }
export async function getOrganisations() { return safeParse("organisations", z.array(organisationItemSchema)); }
export async function getVolunteering() { return safeParse("volunteering", z.array(volunteeringItemSchema)); }
export async function getProjects() { return safeParse("portfolio/projects", z.array(projectSchema)); }
export async function getSocials() { return safeParse("contact/socials", z.array(socialSchema)); }

export async function getProfile(): Promise<Profile> {
  const data = await fetchJson<unknown>("profile");
  const result = data ? profileSchema.safeParse(data) : null;
  return result?.success ? result.data : {} as Profile;
}

export async function getCertifications() {
  const data = await fetchJson<unknown>("certifications");
  const root = (data && typeof data === "object" && "certifications" in data) ? (data as any).certifications : data;
  return Array.isArray(root) ? z.array(certificationItemSchema).parse(root) : [];
}

export async function getMemberships() {
  const data = await fetchJson<unknown>("memberships");
  const result = data ? membershipsSchema.safeParse(data) : null;
  // If the schema is an object wrapping an array, access the property. 
  // If the schema is already the array, just return result.data
  return result?.success ? (result.data as any).memberships : [];
}

export async function getAwards() {
  const data = await fetchJson<unknown>("awards");
  const root = (data && typeof data === "object" && "awards" in data) ? (data as any).awards : data;
  return Array.isArray(root) ? z.array(awardItemSchema).parse(root) : [];
}

const api = {
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
  getSocials,
};

export default api;