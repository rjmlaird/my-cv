import { z } from "zod";

export const socialSchema = z.object({
  key: z.string(),
  name: z.string(),
  url: z.url(),
  icon: z.string(),
  label: z.string(),
  username: z.string(),
  type: z.string(),
  // Added color field with hex validation
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
});

export type Social = z.infer<typeof socialSchema>;