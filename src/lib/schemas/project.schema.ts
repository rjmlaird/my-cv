import { z } from "zod";

// Base schema for shared project fields
const baseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime({ offset: true }),
  tags: z.array(z.string()).default([]),
  content: z.string().optional(),
});

// Schema for external links
// Corrected: .url() must be called on a string schema
export const projectLinksSchema = z.object({
  github: z.url().optional(),
  live: z.url().optional(),
  demo: z.url().optional(),
  docs: z.url().optional(),
  video: z.url().optional(),
  store: z.url().optional(),
  api: z.url().optional(),
});

// Main project schema
export const projectSchema = baseSchema.extend({
  type: z.string().optional(),
  status: z.string().optional(),
  tools_tech: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  links: projectLinksSchema.optional(),
  impact: z.record(z.string(), z.unknown()).optional(),
  caseStudy: z.string().optional(),
  client: z.string().optional(),
  organisation: z.string().optional(),
  institution: z.string().optional(),
});

// Export types for easy reference in other files
export type ProjectItem = z.infer<typeof projectSchema>;
export type ProjectLinks = z.infer<typeof projectLinksSchema>;