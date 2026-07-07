import { z } from "zod";

export const skillGroupSchema = z.object({
  label: z.string(),
  kind: z.enum(["hard", "soft", "mixed"]),
  keywords: z.array(z.string()),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;
