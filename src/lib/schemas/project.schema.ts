// project.schema.ts (enhanced portfolio + graph model)

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

/**
 * -----------------------
 * CORE RELATED ENTITIES
 * -----------------------
 */

export interface Client {
  name: string;
  slug?: string;
  url?: string;
  sector?: string;
}

export interface Experience {
  organisation: string;
  role?: string;
  period?: string; // e.g. "2024–2026"
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

/**
 * -----------------------
 * CORE PROJECT ENTITY
 * -----------------------
 */

export interface BaseProject {
  id: number;
  slug: string;
  title: string;
  description: string;

  type: ProjectType;
  status: ProjectStatus;

  date: string; // ISO format recommended: YYYY-MM or YYYY-MM-DD

  /**
   * Core stack + capabilities
   */
  tools_tech: string[];
  features: string[];
  tags: string[];

  /**
   * External + internal links
   */
  links: ProjectLinks;

  /**
   * -----------------------
   * RICH CONTEXT LAYERS
   * -----------------------
   */

  client?: Client | Client[];
  experience?: Experience | Experience[];

  case_studies?: CaseStudy[];
  articles?: Article[];
  awards?: Award[];

  /**
   * Optional analytics / impact layer
   */
  impact?: {
    users?: number;
    stars?: number;
    downloads?: number;
    engagement?: number;
    revenue?: number;
    notes?: string;
    [key: string]: number | string | undefined;
  };

  /**
   * Optional relational graph hints
   */
  related_projects?: string[]; // slugs
  related_people?: string[]; // future expansion
  related_orgs?: string[]; // organisation slugs
}

/**
 * -----------------------
 * PROJECT TYPES
 * -----------------------
 */

export interface FeaturedProject extends BaseProject {
  type: "featured";
}

export interface CollaborativeProject extends BaseProject {
  type: "collaborative";
  collaborators?: string[];
}

export interface CommunityProject extends BaseProject {
  type: "community";
  community_role?: string;
}

export interface OtherProject extends BaseProject {
  type: "other" | "automation";
  automation_level?: "low" | "medium" | "high";
}

/**
 * -----------------------
 * UNION TYPE
 * -----------------------
 */

export type Project =
  | FeaturedProject
  | CollaborativeProject
  | CommunityProject
  | OtherProject;

/**
 * -----------------------
 * COLLECTION SHAPE
 * -----------------------
 */

export interface ProjectsSchema {
  featured_projects: FeaturedProject[];
  collaborative_projects: CollaborativeProject[];
  community_projects: CommunityProject[];
  other_projects: OtherProject[];
}