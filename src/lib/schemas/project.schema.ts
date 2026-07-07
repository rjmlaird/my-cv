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
