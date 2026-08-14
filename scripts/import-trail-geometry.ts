import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { DOMParser } from "@xmldom/xmldom";
import { gpx, kml } from "@tmcw/togeojson";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { trails } from "@/db/schema";

type LineStringGeometry = { type: "LineString"; coordinates: [number, number][] };

function extractLineString(featureCollection: GeoJSON.FeatureCollection): LineStringGeometry {
  const coordinates: [number, number][] = [];

  for (const feature of featureCollection.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === "LineString") {
      coordinates.push(...(geom.coordinates as [number, number][]));
    } else if (geom.type === "MultiLineString") {
      for (const line of geom.coordinates as [number, number][][]) {
        coordinates.push(...line);
      }
    }
  }

  if (coordinates.length === 0) {
    throw new Error(
      "No LineString/MultiLineString geometry found in the file (expected a <trk>/<rte> in GPX or a LineString in KML).",
    );
  }

  return { type: "LineString", coordinates };
}

function haversineKm([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function totalDistanceKm(coords: [number, number][]) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineKm(coords[i - 1], coords[i]);
  }
  return total;
}

async function main() {
  const [, , trailSlug, filePath] = process.argv;
  if (!trailSlug || !filePath) {
    console.error("Usage: pnpm import:trail <trail-slug> <path-to-file.gpx|.kml>");
    process.exit(1);
  }

  const trail = await db.query.trails.findFirst({ where: eq(trails.slug, trailSlug) });
  if (!trail) {
    console.error(`No trail found with slug "${trailSlug}". Create it first (e.g. via the seed script).`);
    process.exit(1);
  }

  const ext = extname(filePath).toLowerCase();
  const xml = readFileSync(filePath, "utf-8");
  const doc = new DOMParser().parseFromString(xml, "text/xml") as unknown as Document;

  let featureCollection: GeoJSON.FeatureCollection;
  if (ext === ".gpx") {
    featureCollection = gpx(doc) as GeoJSON.FeatureCollection;
  } else if (ext === ".kml") {
    featureCollection = kml(doc) as GeoJSON.FeatureCollection;
  } else {
    console.error(`Unsupported file extension "${ext}". Expected .gpx or .kml.`);
    process.exit(1);
  }

  const lineString = extractLineString(featureCollection);
  const distanceKm = totalDistanceKm(lineString.coordinates);

  await db
    .update(trails)
    .set({ geometry: JSON.stringify(lineString) })
    .where(eq(trails.id, trail.id));

  console.log(
    `Imported geometry for "${trail.title}": ${lineString.coordinates.length} points, ` +
      `~${distanceKm.toFixed(1)} km (trail.distance_km is set to ${trail.distanceKm ?? "unset"} — update manually if it should change).`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
