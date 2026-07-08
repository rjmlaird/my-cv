import { z } from "astro/zod";

export const awardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  year: z.number(),

  type: z.string().optional(),
  role: z.string().optional(),
  event: z.string().optional(),
  session_title: z.string().optional(),
  project: z.string().optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  value: z.string().optional(),
  programme: z.string().optional(),
  funded_by: z.array(z.string()).optional(),
  location: z.string().optional(),
  instrument: z.string().optional(),
  duration: z.string().optional(),
  research_area: z.string().optional(),
  award: z.string().optional(),
  items: z.array(z.string()).optional(),

  keywords: z.array(z.string()).default([]),
  entities: z.array(z.string()).default([]),

  description: z.string().default(""),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type AwardItem = z.infer<typeof awardItemSchema>;
