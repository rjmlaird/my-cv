import { z } from "zod";
import { socialSchema } from "./base.schema";

export const profileSchema = z.object({
  name: z.string(),
  preferredName: z.string().optional(),
  pronouns: z.string().optional(),
  headline: z.string(),
  biography: z.string(),
  location: z.string(),
  email: z.string().email(),
  website: z.string().url(),
  avatar: z.string(),
  credentials: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  socials: z.array(socialSchema).default([]),
});

export type Profile = z.infer<typeof profileSchema>;
