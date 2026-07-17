import { z } from "zod";

export const socialSchema = z.object({
  key: z.string(),
  name: z.string(),
  url: z.url(),
  icon: z.string(),
  label: z.string(),
  username: z.string(),
  type: z.string(),
});

export type Social = z.infer<typeof socialSchema>;