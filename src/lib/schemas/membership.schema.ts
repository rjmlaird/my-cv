export type MembershipType =
  | "chartered_body"
  | "professional_body"
  | "scientific_body"
  | "security_body"
  | "industry_association"
  | "climate_network"
  | "research_network"
  | "media_network"
  | "creative_network"
  | "space_network"
  | "urban_network"
  | "sustainability_network"
  | "business_association"
  | "startup_network"
  | "community_network"
  | "ethics_framework"
  | "education_network"
  | "framework_network"
  | "economic_network"
  | "advocacy_network"
  | "climate_lab"
  | "industry_initiative"
  | "nonprofit_network"
  | "ethics_network"
  | "business_climate_network"
  | "education_network"
  | "space_network"
  | "urban_innovation_network";

export type MembershipRole =
  | "Member"
  | "Associate Member"
  | "Certified Member"
  | "Fellow"
  | "Chartered Marketer (CMktr)"
  | "Supporter"
  | string;

export interface MembershipItem {
  /** Human-readable organisation name */
  organisation: string;

  /** URL-safe slug for routing / CMS */
  slug: string;

  /** Stable internal identifier used across datasets */
  organisationSlug: string;

  /** User’s role within the organisation */
  role: MembershipRole;

  /** Classification of organisation */
  type: MembershipType;

  /** Optional descriptive context for search, tagging, clustering */
  description?: string;

  /** Optional SEO / graph enrichment tags */
  keywords?: string[];

  /** Optional external links */
  links?: {
    website?: string;
    profile?: string;
  };

  /** Optional temporal metadata for lifecycle tracking */
  activeFrom?: string; // ISO date
  activeTo?: string;   // ISO date

  /** Optional confidence / verification layer for data integrity */
  verified?: boolean;
}

export interface MembershipGroup {
  /** Section title for UI grouping */
  title: string;

  /** Membership entries in this group */
  items: MembershipItem[];
}

export interface MembershipSchema {
  memberships: MembershipGroup[];
}