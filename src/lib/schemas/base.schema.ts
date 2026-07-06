import { z } from "zod";

export const DEFAULT_FEATURED_IMAGE = "/images/default-featured.jpg";

export const seoSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  image: z.string().default(DEFAULT_FEATURED_IMAGE),
});

export const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const socialSchema = z.object({
  platform: z.string(),
  username: z.string().optional(),
  url: z.string().url(),
  icon: z.string().optional(),
});

export const imageSchema = z.object({
  src: z.string(),
  alt: z.string().default(""),
});

export const baseSchema = z.object({
  id: z.string(),

  slug: z.string(),

  title: z.string(),

  summary: z.string().default(""),

  description: z.string().default(""),

  featured: z.boolean().default(false),

  featuredImage: z.string().default(DEFAULT_FEATURED_IMAGE),

  tags: z.array(z.string()).default([]),

  seo: seoSchema.default({
    title: "",
    description: "",
    image: DEFAULT_FEATURED_IMAGE,
  }),

  created: z.string().optional(),

  updated: z.string().optional(),
});

export type Base = z.infer<typeof baseSchema>;