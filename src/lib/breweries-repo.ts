import { eq } from "drizzle-orm";
import { db } from "@/db";
import { breweries, regions, trailBreweries, trails } from "@/db/schema";
import { slugify } from "@/lib/slug";

export type BreweryInput = {
  name: string;
  village: string;
  regionName: string;
  lat: number;
  lng: number;
  googlePlaceId?: string;
  visited: boolean;
  visitedAt?: string;
  myRating?: number;
  myComment?: string;
  recommendationSource?: string;
  featured: boolean;
  openingHoursOverride?: string;
  openingHoursNote?: string;
};

async function findOrCreateRegion(name: string) {
  const slug = slugify(name);
  const existing = await db.query.regions.findFirst({ where: eq(regions.slug, slug) });
  if (existing) return existing;
  const [created] = await db.insert(regions).values({ name, slug }).returning();
  return created;
}

function uniqueSlugBase(name: string, village: string) {
  return slugify(`${name}-${village}`);
}

async function uniqueBrewerySlug(name: string, village: string, excludeId?: number) {
  const base = uniqueSlugBase(name, village);
  let candidate = base;
  let attempt = 1;
  // small dataset (personal blog scale) — a loop here is fine, no need for a fancier approach
  while (true) {
    const existing = await db.query.breweries.findFirst({ where: eq(breweries.slug, candidate) });
    if (!existing || existing.id === excludeId) return candidate;
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }
}

export async function listBreweriesWithRegion() {
  return db.query.breweries.findMany({
    with: { region: true },
    orderBy: (b, { asc }) => [asc(b.name)],
  });
}

export async function getBreweryById(id: number) {
  return db.query.breweries.findFirst({
    where: eq(breweries.id, id),
    with: { region: true },
  });
}

export async function listRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

export async function listTrails() {
  return db.select().from(trails).orderBy(trails.title);
}

export async function createBrewery(input: BreweryInput) {
  const region = await findOrCreateRegion(input.regionName);
  const slug = await uniqueBrewerySlug(input.name, input.village);
  const now = new Date().toISOString();
  const [created] = await db
    .insert(breweries)
    .values({
      slug,
      name: input.name,
      village: input.village,
      regionId: region.id,
      lat: input.lat,
      lng: input.lng,
      googlePlaceId: input.googlePlaceId || null,
      visited: input.visited,
      visitedAt: input.visitedAt || null,
      myRating: input.myRating ?? null,
      myComment: input.myComment || null,
      recommendationSource: input.recommendationSource || null,
      featured: input.featured,
      openingHoursOverride: input.openingHoursOverride || null,
      openingHoursNote: input.openingHoursNote || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function updateBrewery(id: number, input: BreweryInput) {
  const region = await findOrCreateRegion(input.regionName);
  const existing = await getBreweryById(id);
  const slug =
    existing && existing.name === input.name && existing.village === input.village
      ? existing.slug
      : await uniqueBrewerySlug(input.name, input.village, id);

  const [updated] = await db
    .update(breweries)
    .set({
      slug,
      name: input.name,
      village: input.village,
      regionId: region.id,
      lat: input.lat,
      lng: input.lng,
      googlePlaceId: input.googlePlaceId || null,
      visited: input.visited,
      visitedAt: input.visitedAt || null,
      myRating: input.myRating ?? null,
      myComment: input.myComment || null,
      recommendationSource: input.recommendationSource || null,
      featured: input.featured,
      openingHoursOverride: input.openingHoursOverride || null,
      openingHoursNote: input.openingHoursNote || null,
      openingHoursVerifiedAt: input.openingHoursOverride || input.openingHoursNote
        ? new Date().toISOString()
        : existing?.openingHoursVerifiedAt ?? null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(breweries.id, id))
    .returning();
  return updated;
}

export async function listBreweryTrailAssignments(breweryId: number) {
  return db.query.trailBreweries.findMany({
    where: eq(trailBreweries.breweryId, breweryId),
    with: { trail: true },
  });
}

export type BreweryForMap = {
  id: number;
  slug: string;
  name: string;
  village: string;
  lat: number;
  lng: number;
  googlePlaceId: string | null;
  visited: boolean;
  visitedAt: string | null;
  myRating: number | null;
  myComment: string | null;
  recommendationSource: string | null;
  featured: boolean;
  googleRating: number | null;
  googleRatingCount: number | null;
  googleMapsUrl: string | null;
  openingHoursOverride: string | null;
  openingHoursNote: string | null;
  openingHoursVerifiedAt: string | null;
  googleOpenNow: boolean | null;
  googleOpeningHoursJson: string | null;
  region: { id: number; name: string; slug: string };
  trailSlugs: string[];
};

export async function listBreweriesForMap(): Promise<BreweryForMap[]> {
  const rows = await db.query.breweries.findMany({
    with: {
      region: true,
      trailBreweries: { with: { trail: true } },
    },
    orderBy: (b, { asc }) => [asc(b.name)],
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    village: row.village,
    lat: row.lat,
    lng: row.lng,
    googlePlaceId: row.googlePlaceId,
    visited: row.visited,
    visitedAt: row.visitedAt,
    myRating: row.myRating,
    myComment: row.myComment,
    recommendationSource: row.recommendationSource,
    featured: row.featured,
    googleRating: row.googleRating,
    googleRatingCount: row.googleRatingCount,
    googleMapsUrl: row.googleMapsUrl,
    openingHoursOverride: row.openingHoursOverride,
    openingHoursNote: row.openingHoursNote,
    openingHoursVerifiedAt: row.openingHoursVerifiedAt,
    googleOpenNow: row.googleOpenNow,
    googleOpeningHoursJson: row.googleOpeningHoursJson,
    region: { id: row.region.id, name: row.region.name, slug: row.region.slug },
    trailSlugs: row.trailBreweries.map((tb) => tb.trail.slug),
  }));
}
