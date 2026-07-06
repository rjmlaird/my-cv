// reviews.schema.ts

/**
 * -----------------------
 * CORE TYPES
 * -----------------------
 */

export interface Reviewer {
  name: string;
  slug?: string;
  avatar?: string;

  position?: string;
  company?: string;
  companySlug?: string;

  linkedin?: string;
  website?: string;
}

export type ReviewContext =
  | "collaboration"
  | "employment"
  | "internship"
  | "consulting"
  | "speaking"
  | "education"
  | "general";

export type ReviewSentiment =
  | "positive"
  | "strong_positive"
  | "neutral";

/**
 * -----------------------
 * REVIEW ENTITY
 * -----------------------
 */

export interface Review {
  id?: string;

  content: string;

  author: Reviewer;

  /**
   * Optional organisation link (graph-ready)
   */
  organisation?: {
    name: string;
    slug?: string;
    industry?: string;
    url?: string;
  };

  /**
   * Contextual metadata
   */
  context?: ReviewContext;

  position?: string; // fallback if not structured in author
  company?: string; // fallback if not structured in organisation

  avatar?: string; // fallback (legacy compatibility)

  /**
   * Classification + filtering
   */
  tags?: string[];

  sentiment?: ReviewSentiment;

  /**
   * Optional verification layer (useful for credibility systems)
   */
  verified?: boolean;
  verified_by?: string; // e.g. "LinkedIn", "Email", "Manual"

  /**
   * Optional relational graph hooks
   */
  related_projects?: string[]; // project slugs
  related_experience?: string[]; // experience IDs
  related_case_studies?: string[];

  /**
   * Metadata
   */
  date?: string;
  source?: string; // e.g. LinkedIn, email, testimonial form

  /**
   * SEO / display control
   */
  featured?: boolean;
}

/**
 * -----------------------
 * COLLECTION SHAPE
 * -----------------------
 */

export interface ReviewsSchema {
  reviews: Review[];
}