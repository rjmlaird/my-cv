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

export interface Review {
  id?: string;
  content: string;
  author: Reviewer;
  organisation?: {
    name: string;
    slug?: string;
    industry?: string;
    url?: string;
  };
  context?: ReviewContext;
  position?: string;
  company?: string;
  avatar?: string;
  tags?: string[];
  sentiment?: ReviewSentiment;
  verified?: boolean;
  verified_by?: string;
  related_projects?: string[];
  related_experience?: string[];
  related_case_studies?: string[];
  date?: string;
  source?: string;
  featured?: boolean;
}

export interface ReviewsSchema {
  reviews: Review[];
}
