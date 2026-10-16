import { z } from "zod";

export const membershipItemSchema = z.object({
  /** Organisation the membership is with (registry slug). */
  organisationSlug: z.string(),
  role: z.string(),
});

export const membershipGroupSchema = z.object({
  title: z.string(),
  items: z.array(membershipItemSchema),
});

export const membershipsSchema = z.object({
  memberships: z.array(membershipGroupSchema),
});

export type MembershipItem = z.infer<typeof membershipItemSchema>;
export type MembershipGroup = z.infer<typeof membershipGroupSchema>;
export type Memberships = z.infer<typeof membershipsSchema>;
