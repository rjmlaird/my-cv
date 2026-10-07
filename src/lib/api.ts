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

// CV_API_BASE lets tests/previews point the build at a mock API.
const API_BASE = process.env.CV_API_BASE ?? "https://api.rjmlaird.co.uk/api";
const MANIFEST_URL = "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev/manifest.json";

const FETCH_TIMEOUT_MS = 15_000;
const FETCH_RETRIES = 1;

/** Set ALLOW_PARTIAL=1 to let a build proceed when critical data is unavailable. */
const ALLOW_PARTIAL = process.env.ALLOW_PARTIAL === "1";

/**
 * Called when data the CV cannot sensibly ship without (profile, experience,
 * education) is missing or invalid. Fails the build so a blank CV is never
 * deployed, unless ALLOW_PARTIAL=1 is set.
 */
function critical(label: string, detail: unknown): void {
  const message = `[API] CRITICAL: ${label} unavailable or invalid. Refusing to build a partial CV (set ALLOW_PARTIAL=1 to override).`;
  console.error(message, detail ?? "");
  if (!ALLOW_PARTIAL) throw new Error(message);
}

async function fetchOnce(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

// One request per URL per build. Every component shares the same snapshot,
// so sections can never disagree and the API is hit once per endpoint.
const requestCache = new Map<string, Promise<unknown | null>>();

function fetchJson<T>(url: string, isFullUrl = false): Promise<T | null> {
  const fullUrl = isFullUrl ? url : `${API_BASE}/${url}`;
  const cached = requestCache.get(fullUrl);
  if (cached) return cached as Promise<T | null>;

  const request = (async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= FETCH_RETRIES; attempt++) {
      try {
        return await fetchOnce(fullUrl);
      } catch (e) {
        lastError = e;
      }
    }
    console.error(`[API] Failed to fetch ${url}:`, lastError);
    return null;
  })();

  requestCache.set(fullUrl, request);
  return request as Promise<T | null>;
}

/** Some endpoints return `{ <key>: [...] }`, others the bare array. Accept both. */
function unwrap(data: unknown, key: string): unknown {
  return data && typeof data === "object" && key in data ? (data as Record<string, unknown>)[key] : data;
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
  if (!result.success || result.data.length === 0) {
    critical("Experience", result.success ? "empty list" : result.error.issues);
    return [];
  }
  return result.data;
}

export async function getEducation() { 
  const data = await fetchJson<unknown>("education");
  const result = z.array(educationItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Education validation failed:", result.error.issues);
  if (!result.success || result.data.length === 0) {
    critical("Education", result.success ? "empty list" : result.error.issues);
    return [];
  }
  return result.data;
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
  if (!data) {
    critical("Profile", "no response");
    return null;
  }
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    console.error("[API] Profile validation failed:", result.error.issues);
    critical("Profile", result.error.issues);
    return null;
  }
  return result.data;
}

export async function getCertifications() {
  const data = await fetchJson<unknown>("certifications");
  const root = unwrap(data, "certifications");
  const result = z.array(certificationItemSchema).safeParse(root);
  if (!result.success) console.error("[API] Certifications validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getMemberships() {
  const data = await fetchJson<unknown>("memberships");
  const result = membershipsSchema.safeParse(data);
  if (!result.success) console.error("[API] Memberships validation failed:", result.error.issues);
  return result.success ? result.data.memberships : [];
}

export async function getAwards() {
  const data = await fetchJson<unknown>("awards");
  const root = unwrap(data, "awards");
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