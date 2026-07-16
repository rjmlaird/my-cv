import { z } from "zod";

// Base schema for shared project fields
const baseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().datetime(), // Matches ISO strings like "2026-07-01T00:00:00.000Z"
  tags: z.array(z.string()).default([]),
  content: z.string().optional(),
});

// Schema for external links
export const projectLinksSchema = z.object({
  github: z.string().url().optional(),
  live: z.string().url().optional(),
  demo: z.string().url().optional(),
  docs: z.string().url().optional(),
  video: z.string().url().optional(),
  store: z.string().url().optional(),
  api: z.string().url().optional(),
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