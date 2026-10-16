export interface OrganisationItem {
  slug: string;
  name: string;
  shortName?: string | null;
  aliases: string[];
  legacySlugs: string[];
  kind: string;
  sectors: string[];
  relationships: string[];
  url?: string | null;
  hubspotId?: string | null;
  logo?: string | null;
  featured: boolean;
}

/**
 * A content item whose `organisationSlug` has been resolved against the
 * organisation registry. Any legacy `organisation` field on the raw item is
 * replaced by the full registry entry.
 */
export type Resolved<T> = Omit<T, "organisation"> & {
  organisation: OrganisationItem;
};

const norm = (text: string) =>
  text.replace(/\s+/g, " ").trim().toLowerCase();

const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export interface OrganisationIndex {
  list: OrganisationItem[];

  /** Exact slug lookup, including legacy slugs. */
  bySlug(slug: string | null | undefined): OrganisationItem | undefined;

  /** Slug first, then canonical name, short name, or alias. */
  lookup(
    slug?: string | null,
    name?: string | null,
  ): OrganisationItem | undefined;

  /** Placeholder for an unresolved reference, so pages can still render. */
  stub(
    slug?: string | null,
    name?: string | null,
  ): OrganisationItem;

  /** Display name for a slug, falling back to the slug itself. */
  nameOf(slug: string): string;
}

export function buildOrganisationIndex(
  list: OrganisationItem[],
): OrganisationIndex {
  const slugs = new Map<string, OrganisationItem>();
  const names = new Map<string, OrganisationItem>();

  for (const org of list) {
    slugs.set(org.slug, org);

    for (const legacySlug of org.legacySlugs) {
      slugs.set(legacySlug, org);
    }
  }

  for (const org of list) {
    for (const name of [org.name, org.shortName, ...org.aliases]) {
      if (name && !names.has(norm(name))) {
        names.set(norm(name), org);
      }
    }
  }

  const bySlug: OrganisationIndex["bySlug"] = (slug) =>
    slug ? slugs.get(slug) : undefined;

  const lookup: OrganisationIndex["lookup"] = (slug, name) =>
    bySlug(slug) ?? (name ? names.get(norm(name)) : undefined);

  const stub: OrganisationIndex["stub"] = (slug, name) => {
    const label = name?.trim() || slug?.trim() || "";

    return {
      slug: slug?.trim() || slugify(label),
      name: label,
      shortName: null,
      aliases: [],
      legacySlugs: [],
      kind: "other",
      sectors: [],
      relationships: [],
      url: null,
      hubspotId: null,
      logo: null,
      featured: false,
    };
  };

  return {
    list,
    bySlug,
    lookup,
    stub,
    nameOf: (slug) => slugs.get(slug)?.name ?? slug,
  };
}
