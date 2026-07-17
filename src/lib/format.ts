/**
 * Shared formatting helpers for dates and simple text joins,
 * used across page-level views (e.g. AtsView) and structured-data builders.
 */

/** "2021-05" -> "May 2021", "2021" -> "2021", falsy -> "" */
export function formatDate(value?: string | null): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

/** Renders a start/end range, respecting `current`. */
export function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean,
): string {
  const start = formatDate(startDate);
  const end = current ? "Present" : formatDate(endDate);
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} — ${end}`;
}

/** Joins truthy parts with a separator, dropping empty values. */
export function joinParts(parts: Array<string | undefined | null>, sep = ", "): string {
  return parts.filter((p): p is string => Boolean(p && String(p).trim())).join(sep);
}

/** ISO 8601 date for machine-readable contexts (schema.org, <time datetime>). */
export function toISODate(value?: string | null): string | undefined {
  if (!value) return undefined;
  // Already a bare year or year-month; pad to a valid ISO date.
  const parts = value.split("-");
  if (parts.length === 1) return `${parts[0]}-01-01`;
  if (parts.length === 2) return `${parts[0]}-${parts[1]}-01`;
  return value;
}
