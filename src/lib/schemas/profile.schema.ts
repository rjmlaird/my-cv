import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().optional(),
  preferredName: z.string().optional(),
  pronouns: z.string().optional(),
  headline: z.string().optional(),
  biography: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  avatar: z.string().optional(),
  role: z.string().optional(),
  credentials: z.string().optional(),
  summary: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  portfolioLinks: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().url(),
      })
    )
    .default([]),
  contact: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    )
    .default([]),
});


export type Profile = z.infer<typeof profileSchema>;