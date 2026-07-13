export type ProjectType =
  | "featured"
  | "collaborative"
  | "community"
  | "other"
  | "automation";

export type ProjectStatus =
  | "completed"
  | "in_progress"
  | "archived"
  | "concept";

export type MediaType =
  | "article"
  | "case_study"
  | "award"
  | "talk"
  | "press"
  | "documentation";

export interface ProjectLinks {
  github?: string;
  live?: string;
  demo?: string;
  docs?: string;
  video?: string;
  store?: string;
  api?: string;
  [key: string]: string | undefined;
}

export interface Client {
  name: string;
  slug?: string;
  url?: string;
  sector?: string;
}

export interface Experience {
  organisation: string;
  role?: string;
  period?: string;
  context?: string;
}

export interface CaseStudy {
  title: string;
  slug: string;
  url?: string;
  summary?: string;
}

export interface Article {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

export interface Award {
  title: string;
  organisation?: string;
  year?: string;
  url?: string;
}

export interface BaseProject {
  id: number;
  slug: string;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  date: string;
  toolsTech: string[];
  features: string[];
  tags: string[];
  links: ProjectLinks;
  client?: Client | Client[];
  experience?: Experience | Experience[];
  caseStudies?: CaseStudy[];
  articles?: Article[];
  awards?: Award[];
  impact?: {
    users?: number;
    stars?: number;
    downloads?: number;
    engagement?: number;
    revenue?: number;
    notes?: string;
    [key: string]: number | string | undefined;
  };
  relatedProjects?: string[];
  relatedPeople?: string[];
  relatedOrgs?: string[];
}

export interface FeaturedProject extends BaseProject {
  type: "featured";
}

export interface CollaborativeProject extends BaseProject {
  type: "collaborative";
  collaborators?: string[];
}

export interface CommunityProject extends BaseProject {
  type: "community";
  communityRole?: string;
}

export interface OtherProject extends BaseProject {
  type: "other" | "automation";
  automationLevel?: "low" | "medium" | "high";
}

export type Project =
  | FeaturedProject
  | CollaborativeProject
  | CommunityProject
  | OtherProject;

export interface ProjectsSchema {
  featured_projects: FeaturedProject[];
  collaborative_projects: CollaborativeProject[];
  community_projects: CommunityProject[];
  other_projects: OtherProject[];
}

// --- Runtime (zod) validation -------------------------------------------
// The TS types above previously had no matching runtime schema, so nothing
// validated project data from the API and no page consumed it. This mirrors
// BaseProject loosely and permissively (API data here is still evolving),
// and adds an optional `skills` tag array — separate from the existing
// freeform `tags` — for cross-referencing against the skills content
// collection (src/content/skills) the same way experience/education do.
import { z } from "zod";

const projectLinksSchema = z.record(z.string(), z.string().url()).optional();

const clientSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  url: z.string().url().optional(),
  sector: z.string().optional(),
});

const experienceRefSchema = z.object({
  organisation: z.string(),
  role: z.string().optional(),
  period: z.string().optional(),
  context: z.string().optional(),
});

const caseStudySchema = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
});

const articleRefSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
  date: z.string().optional(),
});

const awardRefSchema = z.object({
  title: z.string(),
  organisation: z.string().optional(),
  year: z.string().optional(),
  url: z.string().url().optional(),
});

export const projectItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  slug: z.string(),
  title: z.string(),
  description: z.string().default(""),
  type: z.enum(["featured", "collaborative", "community", "other", "automation"]).default("other"),
  status: z.enum(["completed", "in_progress", "archived", "concept"]).default("completed"),
  date: z.string().optional(),
  toolsTech: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  // Optional — tag slugs cross-referenced against src/content/skills.
  skills: z.array(z.string()).optional().default([]),
  links: projectLinksSchema,
  client: z.union([clientSchema, z.array(clientSchema)]).optional(),
  experience: z.union([experienceRefSchema, z.array(experienceRefSchema)]).optional(),
  caseStudies: z.array(caseStudySchema).optional(),
  articles: z.array(articleRefSchema).optional(),
  awards: z.array(awardRefSchema).optional(),
  impact: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
  relatedProjects: z.array(z.string()).optional(),
  relatedPeople: z.array(z.string()).optional(),
  relatedOrgs: z.array(z.string()).optional(),
  collaborators: z.array(z.string()).optional(),
  communityRole: z.string().optional(),
  automationLevel: z.enum(["low", "medium", "high"]).optional(),
});

export type ProjectItem = z.infer<typeof projectItemSchema>;

export const projectsResponseSchema = z.union([
  z.array(projectItemSchema),
  z
    .object({
      featured_projects: z.array(projectItemSchema).optional(),
      collaborative_projects: z.array(projectItemSchema).optional(),
      community_projects: z.array(projectItemSchema).optional(),
      other_projects: z.array(projectItemSchema).optional(),
    })
    .transform((grouped) => [
      ...(grouped.featured_projects ?? []),
      ...(grouped.collaborative_projects ?? []),
      ...(grouped.community_projects ?? []),
      ...(grouped.other_projects ?? []),
    ]),
]);
