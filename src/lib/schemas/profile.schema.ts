import { z } from "zod";

export const profileSchema = z.object({
  // Basic Identity
  name: z.string(),
  preferredName: z.string().optional().nullable(),
  pronouns: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  
  // Contact & Location
  email: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  
  // Content - These are the fields your Hero component expects
  biography: z.array(z.string()).default([]),
  summary: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  // Professional Metadata
  credentials: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  
  // Links
  portfolioLinks: z.array(
    z.object({
      label: z.string(),
      href: z.string().url(),
    })
  ).default([]),
});