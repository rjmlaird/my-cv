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
import { membershipsSchema } from "@/lib/schemas/membership.schema";
import { ToolDataSchema } from "@/lib/schemas/tool.schema";

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

// --- Data Fetchers with Detailed Error Logging ---

export async function getDocuments() {
  const data = await fetchJson<unknown>(MANIFEST_URL, true);
  return Array.isArray(data) ? data : [];
}

export async function getExperience() { 
  const data = await fetchJson<unknown>("experience");
  const result = z.array(experienceItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Experience validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getEducation() { 
  const data = await fetchJson<unknown>("education");
  const result = z.array(educationItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Education validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getLanguages() { 
  const data = await fetchJson<unknown>("languages");
  const result = z.array(languageItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Languages validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getOrganisations() { 
  const data = await fetchJson<unknown>("organisations");
  const result = z.array(organisationItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Organisations validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getVolunteering() { 
  const data = await fetchJson<unknown>("volunteering");
  const result = z.array(volunteeringItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Volunteering validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getProjects() { 
  const data = await fetchJson<unknown>("portfolio/projects");
  const result = z.array(projectSchema).safeParse(data);
  if (!result.success) console.error("[API] Projects validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getSocials() { 
  const data = await fetchJson<unknown>("socials");
  const result = z.array(socialSchema).safeParse(data);
  if (!result.success) console.error("[API] Socials validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getProfile(): Promise<Profile | null> {
  const data = await fetchJson<unknown>("profile");
  if (!data) return null;
  const result = profileSchema.safeParse(data);
  if (!result.success) console.error("[API] Profile validation failed:", result.error.issues);
  return result.success ? result.data : null;
}

export async function getCertifications() {
  const data = await fetchJson<unknown>("certifications");
  const root = (data && typeof data === "object" && "certifications" in data) ? (data as any).certifications : data;
  const result = z.array(certificationItemSchema).safeParse(root);
  if (!result.success) console.error("[API] Certifications validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getMemberships() {
  const data = await fetchJson<unknown>("memberships");
  const result = membershipsSchema.safeParse(data);
  if (!result.success) console.error("[API] Memberships validation failed:", result.error.issues);
  return result.success ? (result.data as any).memberships : [];
}

export async function getAwards() {
  const data = await fetchJson<unknown>("awards");
  const root = (data && typeof data === "object" && "awards" in data) ? (data as any).awards : data;
  const result = z.array(awardItemSchema).safeParse(root);
  if (!result.success) console.error("[API] Awards validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getTools() {
  const data = await fetchJson<unknown>("tools");
  if (!data) return { categories: [] };
  const result = ToolDataSchema.safeParse(data);
  if (!result.success) console.error("[API] Tools validation failed:", result.error.issues);
  return result.success ? result.data : { categories: [] };
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
  getTools,
};

export default api;