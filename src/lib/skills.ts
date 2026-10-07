import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const skillEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  proficiency: z.string().optional(),
  description: z.string().optional(),
  relatedSkills: z.array(z.string()).default([]),
});

/**
 * skills.yaml accepts two shapes:
 *  1. a map of category key -> list of skill names (current format):
 *       marketing_growth: [SEO, Positioning]
 *  2. an array of rich entries ({ name, category, description, ... }).
 * Anything else is a hard error: a silently empty taxonomy is how every skill
 * ended up "unresolved" before.
 */
const skillTaxonomySchema = z.union([
  z.array(skillEntrySchema),
  z.record(z.string(), z.array(z.string())),
]);

/** Display labels for category keys. Unknown keys fall back to a Title Case of the key. */
const CATEGORY_LABELS: Record<string, string> = {
  marketing_growth: "Marketing & Growth",
  communications_editorial: "Communications & Editorial",
  leadership_collaboration: "Leadership & Collaboration",
  research_analysis: "Research & Analysis",
  education_training: "Education & Training",
  technical_digital: "Technical & Digital",
};

function categoryLabel(key: string): string {
  return (
    CATEGORY_LABELS[key] ??
    key
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export type SkillTaxonomyEntry = z.infer<typeof skillEntrySchema> & { id: string };

let cachedSkills: SkillTaxonomyEntry[] | null = null;
let cachedMap: Map<string, SkillTaxonomyEntry> | null = null;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function loadSkillsYaml(): Promise<SkillTaxonomyEntry[]> {
  if (cachedSkills) return cachedSkills;

  const filePath = path.join(process.cwd(), "src/data/skills.yaml");
  const raw = await readFile(filePath, "utf8");
  const parsed = skillTaxonomySchema.safeParse(parse(raw));
  if (!parsed.success) {
    throw new Error(
      `[skills] src/data/skills.yaml is not a valid taxonomy (expected a category->skills map or an array of entries): ${parsed.error.message}`,
    );
  }

  const entries: z.infer<typeof skillEntrySchema>[] = Array.isArray(parsed.data)
    ? parsed.data
    : Object.entries(parsed.data).flatMap(([key, names]) =>
        names.map((name) => ({ name, category: categoryLabel(key), relatedSkills: [] as string[] })),
      );

  if (entries.length === 0) {
    throw new Error("[skills] src/data/skills.yaml contains no skills.");
  }

  const seen = new Set<string>();
  cachedSkills = entries.map((entry) => {
    const id = entry.id ?? slugify(entry.name);
    if (seen.has(id)) console.warn(`[skills] duplicate skill id "${id}" in skills.yaml; the later entry wins.`);
    seen.add(id);
    return { ...entry, id, relatedSkills: entry.relatedSkills ?? [] };
  });

  return cachedSkills;
}

async function getSkillMap(): Promise<Map<string, SkillTaxonomyEntry>> {
  if (cachedMap) return cachedMap;

  const all = await loadSkillsYaml();
  cachedMap = new Map();

  for (const entry of all) {
    cachedMap.set(entry.id, entry);
    cachedMap.set(slugify(entry.id), entry);
    cachedMap.set(slugify(entry.name), entry);
  }

  return cachedMap;
}

export interface ResolvedSkillTag {
  slug: string;
  label: string;
  href?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  proficiency?: string;
  relatedSkills?: string[];
  resolved: boolean;
}

export async function resolveSkillTags(tags: string[] = []): Promise<ResolvedSkillTag[]> {
  if (!tags.length) return [];
  const map = await getSkillMap();

  return tags
    .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    .map((tag) => {
      const key = slugify(tag);
      const entry = map.get(key) ?? map.get(tag);

      if (entry) {
        return {
          slug: entry.id,
          label: entry.name,
          href: `#skill-${entry.id}`,
          category: entry.category,
          subcategory: entry.subcategory,
          description: entry.description,
          proficiency: entry.proficiency,
          relatedSkills: entry.relatedSkills,
          resolved: true,
        };
      }

      return { slug: key, label: tag, resolved: false };
    });
}

export interface SkillUsageRef {
  label: string;
  href: string;
}

export interface SkillSource {
  tags?: string[];
  ref: SkillUsageRef;
}

export interface AggregatedSkill {
  slug: string;
  label: string;
  category: string;
  subcategory?: string;
  description?: string;
  proficiency?: string;
  relatedSkills?: string[];
  resolved: boolean;
  count: number;
  usedIn: SkillUsageRef[];
}

export async function aggregateSkills(sources: SkillSource[]): Promise<AggregatedSkill[]> {
  const map = await getSkillMap();
  const bySlug = new Map<string, AggregatedSkill>();

  for (const source of sources) {
    const tags = (source.tags ?? []).filter(
      (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
    );

    for (const tag of tags) {
      const key = slugify(tag);
      const entry = map.get(key) ?? map.get(tag);
      const slug = entry ? entry.id : key;
      const existing = bySlug.get(slug);

      if (existing) {
        existing.count += 1;
        if (!existing.usedIn.some((u) => u.href === source.ref.href)) {
          existing.usedIn.push(source.ref);
        }
        continue;
      }

      bySlug.set(slug, {
        slug,
        label: entry ? entry.name : tag,
        category: entry ? entry.category : "Other",
        subcategory: entry?.subcategory,
        description: entry?.description,
        proficiency: entry?.proficiency,
        relatedSkills: entry?.relatedSkills,
        resolved: Boolean(entry),
        count: 1,
        usedIn: [source.ref],
      });
    }
  }

  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export interface SkillCategoryGroup {
  category: string;
  skills: AggregatedSkill[];
}

export function groupSkillsByCategory(skills: AggregatedSkill[]): SkillCategoryGroup[] {
  const byCategory = new Map<string, AggregatedSkill[]>();

  for (const skill of skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }

  return [...byCategory.entries()]
    .map(([category, skills]) => ({ category, skills }))
    .sort((a, b) => {
      if (a.category === "Other") return 1;
      if (b.category === "Other") return -1;
      return a.category.localeCompare(b.category);
    });
}
