import { eq } from "drizzle-orm";
import { db } from "@/db";
import { breweries } from "@/db/schema";

const FIELD_MASK = "rating,userRatingCount,googleMapsUri,currentOpeningHours";

type PlaceDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  currentOpeningHours?: { openNow?: boolean } & Record<string, unknown>;
};

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<PlaceDetailsResponse> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API returned ${res.status}: ${body}`);
  }

  return (await res.json()) as PlaceDetailsResponse;
}

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY is not set — add it to .env.local.");
    process.exit(1);
  }

  const rows = await db.query.breweries.findMany({
    where: (b, { isNotNull }) => isNotNull(b.googlePlaceId),
  });

  if (rows.length === 0) {
    console.log("No breweries have a google_place_id set yet — nothing to refresh.");
    return;
  }

  console.log(`Refreshing Google data for ${rows.length} breweries…`);

  let succeeded = 0;
  let failed = 0;

  for (const brewery of rows) {
    try {
      const details = await fetchPlaceDetails(brewery.googlePlaceId!, apiKey);
      await db
        .update(breweries)
        .set({
          googleRating: details.rating ?? null,
          googleRatingCount: details.userRatingCount ?? null,
          googleMapsUrl: details.googleMapsUri ?? null,
          googleOpenNow: details.currentOpeningHours?.openNow ?? null,
          googleOpeningHoursJson: details.currentOpeningHours
            ? JSON.stringify(details.currentOpeningHours)
            : null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(breweries.id, brewery.id));
      console.log(`✓ ${brewery.name}: rating=${details.rating ?? "—"} openNow=${details.currentOpeningHours?.openNow ?? "unknown"}`);
      succeeded += 1;
    } catch (err) {
      console.error(`✗ ${brewery.name}: ${(err as Error).message}`);
      failed += 1;
    }
  }

  console.log(`Done. ${succeeded} updated, ${failed} failed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
