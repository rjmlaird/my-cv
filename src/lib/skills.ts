import { getCollection, type CollectionEntry } from "astro:content";

export type SkillEntry = CollectionEntry<"skills">;

let cachedSkills: SkillEntry[] | null = null;
let cachedMap: Map<string, SkillEntry> | null = null;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllSkills(): Promise<SkillEntry[]> {
  if (!cachedSkills) {
    cachedSkills = await getCollection("skills");
  }
  return cachedSkills;
}

async function getSkillMap(): Promise<Map<string, SkillEntry>> {
  if (!cachedMap) {
    const all = await getAllSkills();
    cachedMap = new Map();
    for (const entry of all) {
      cachedMap.set(entry.id, entry);
      cachedMap.set(slugify(entry.data.name), entry);
    }
  }
  return cachedMap;
}

export interface ResolvedSkillTag {
  /** The slug to anchor-link to in the Skills section, if resolved. */
  slug: string;
  /** Display label — the canonical name if resolved, otherwise the raw tag. */
  label: string;
  /** Present only when the tag matched an entry in the skills collection. */
  href?: string;
  category?: string;
  description?: string;
  resolved: boolean;
}

/**
 * Resolves raw skill tag strings (as supplied by the API, in either slug or
 * free-text form) against the local skills content collection. Unmatched
 * tags degrade gracefully to a plain, unlinked pill so the site never
 * breaks while the API is still being populated with matching tags.
 */
export async function resolveSkillTags(tags: string[] = []): Promise<ResolvedSkillTag[]> {
  if (!tags || tags.length === 0) return [];
  const map = await getSkillMap();

  return tags
    .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    .map((tag) => {
      const key = slugify(tag);
      const entry = map.get(key) ?? map.get(tag);

      if (entry) {
        return {
          slug: entry.id,
          label: entry.data.name,
          href: `#skill-${entry.id}`,
          category: entry.data.category,
          description: entry.data.description,
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
  /** Raw skill tag strings from one experience/education/project entry. */
  tags?: string[];
  /** Where to link back to that entry from the Skills section. */
  ref: SkillUsageRef;
}

export interface AggregatedSkill {
  slug: string;
  label: string;
  /** The matched content-collection category, or "Other" for untagged skills. */
  category: string;
  description?: string;
  proficiency?: string;
  /** Whether this tag matched an entry in the local skills collection. */
  resolved: boolean;
  /** How many CV entries reference this skill — drives display order. */
  count: number;
  usedIn: SkillUsageRef[];
}

/**
 * Builds the Skills section's content directly from what's actually tagged
 * on experience, education, and project entries — rather than a hand-curated
 * list. A skill only appears here if it's genuinely applied somewhere on the
 * CV; the local skills collection only supplies enrichment (category,
 * description) when a tag matches a known slug/name, it never adds skills
 * that aren't in use.
 */
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
        label: entry ? entry.data.name : tag,
        category: entry ? entry.data.category : "Other",
        description: entry?.data.description,
        proficiency: entry?.data.proficiency,
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

/**
 * Cross-references a list of project name/slug strings (as stored on
 * experience and education entries) against a resolved projects list so
 * they can be rendered as links back to the Projects section rather than
 * inert text.
 */
export function resolveProjectRefs<T extends { id: string | number; slug: string; title: string }>(
  refs: string[] = [],
  projects: T[] = [],
) {
  const bySlug = new Map<string, T>();
  for (const project of projects) {
    bySlug.set(project.slug, project);
    bySlug.set(slugify(project.title), project);
  }

  return (refs ?? [])
    .filter((ref): ref is string => typeof ref === "string" && ref.trim().length > 0)
    .map((ref) => {
      const match = bySlug.get(slugify(ref)) ?? bySlug.get(ref);
      return match
        ? { label: match.title, href: `#project-${match.slug}`, resolved: true }
        : { label: ref, resolved: false };
    });
}
