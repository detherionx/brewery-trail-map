import { eq } from "drizzle-orm";
import { db } from "@/db";
import { trails } from "@/db/schema";

export type TrailForMap = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  officialSourceUrl: string | null;
  distanceKm: number | null;
  regionSlug: string;
  geometry: GeoJSON.LineString | null;
};

export async function listTrailsForMap(): Promise<TrailForMap[]> {
  const rows = await db.query.trails.findMany({
    with: { region: true },
    orderBy: (t, { asc }) => [asc(t.title)],
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    officialSourceUrl: row.officialSourceUrl,
    distanceKm: row.distanceKm,
    regionSlug: row.region.slug,
    geometry: row.geometry ? (JSON.parse(row.geometry) as GeoJSON.LineString) : null,
  }));
}

export async function getTrailBySlugForMap(slug: string): Promise<TrailForMap | undefined> {
  const row = await db.query.trails.findFirst({
    where: eq(trails.slug, slug),
    with: { region: true },
  });
  if (!row) return undefined;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    officialSourceUrl: row.officialSourceUrl,
    distanceKm: row.distanceKm,
    regionSlug: row.region.slug,
    geometry: row.geometry ? (JSON.parse(row.geometry) as GeoJSON.LineString) : null,
  };
}
