import { db } from "@/db";
import { breweries, regions, trailBreweries, trails } from "@/db/schema";

async function main() {
  console.log("Seeding sample data…");

  const [bamberg] = await db
    .insert(regions)
    .values({ name: "Bamberg", slug: "bamberg" })
    .returning();
  const [fraenkischeSchweiz] = await db
    .insert(regions)
    .values({ name: "Fränkische Schweiz", slug: "fraenkische-schweiz" })
    .returning();

  const [trail13] = await db
    .insert(trails)
    .values({
      slug: "13-brauereien-weg",
      title: "13-Brauereien-Weg",
      description: "The classic Fränkische Schweiz brewery hiking trail through Aufseß and neighboring villages.",
      officialSourceUrl: "https://www.fraenkische-schweiz.com/",
      distanceKm: 32,
      regionId: fraenkischeSchweiz.id,
      geometry: null,
    })
    .returning();

  const [trailAufsess] = await db
    .insert(trails)
    .values({
      slug: "aufsess",
      title: "Aufseß",
      description: "Short loop around Aufseß, said to have the highest brewery density per capita in the world.",
      distanceKm: 12,
      regionId: fraenkischeSchweiz.id,
      geometry: null,
    })
    .returning();

  const seedBreweries = [
    {
      slug: "brauerei-reichold-hochstahl",
      name: "Brauerei Reichold",
      village: "Hochstahl",
      regionId: fraenkischeSchweiz.id,
      lat: 49.9186,
      lng: 11.2953,
      googlePlaceId: null,
      visited: true,
      visitedAt: "2026-08-08",
      myRating: 4.5,
      myComment:
        "One of the stronger stops on the route: proper village brewery atmosphere and the Kellerbier is the reason to come.",
      recommendationSource: "13-brauereien-weg",
      featured: true,
      googleRating: 4.7,
      googleRatingCount: 243,
      googleMapsUrl: null,
    },
    {
      slug: "brauerei-hoffmann-aufsess",
      name: "Brauerei Hoffmann",
      village: "Aufseß",
      regionId: fraenkischeSchweiz.id,
      lat: 49.9075,
      lng: 11.2758,
      googlePlaceId: null,
      visited: true,
      visitedAt: "2026-08-08",
      myRating: 4,
      myComment: null,
      recommendationSource: "aufsess",
      featured: false,
      googleRating: 4.4,
      googleRatingCount: 112,
      googleMapsUrl: null,
    },
    {
      slug: "brauerei-lieberth-hauendorf",
      name: "Brauerei Lieberth",
      village: "Hauendorf",
      regionId: fraenkischeSchweiz.id,
      lat: 49.9243,
      lng: 11.2611,
      googlePlaceId: null,
      visited: false,
      visitedAt: null,
      myRating: null,
      myComment: null,
      recommendationSource: "13-brauereien-weg",
      featured: false,
      googleRating: 4.3,
      googleRatingCount: 87,
      googleMapsUrl: null,
    },
    {
      slug: "schlenkerla-bamberg",
      name: "Schlenkerla",
      village: "Bamberg",
      regionId: bamberg.id,
      lat: 49.8926,
      lng: 10.8845,
      googlePlaceId: null,
      visited: true,
      visitedAt: "2026-05-20",
      myRating: 5,
      myComment: "The Rauchbier everyone tells you to try, and they're right — go early to actually get a table.",
      recommendationSource: "local-account",
      featured: true,
      googleRating: 4.5,
      googleRatingCount: 8200,
      googleMapsUrl: null,
    },
  ];

  const insertedBreweries = [];
  for (const b of seedBreweries) {
    const [inserted] = await db.insert(breweries).values(b).returning();
    insertedBreweries.push(inserted);
  }

  await db.insert(trailBreweries).values([
    { trailId: trail13.id, breweryId: insertedBreweries[0].id, sequence: 1 },
    { trailId: trail13.id, breweryId: insertedBreweries[2].id, sequence: 2 },
    { trailId: trailAufsess.id, breweryId: insertedBreweries[1].id, sequence: 1 },
  ]);

  console.log(
    `Seeded ${insertedBreweries.length} breweries across 2 regions and 2 trails ` +
      `(${trail13.title}, ${trailAufsess.title}).`,
  );
  console.log("Note: trail geometry is null until you run `pnpm import:trail` with a real GPX/KML file.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
