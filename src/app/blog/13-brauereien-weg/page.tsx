import { notFound } from "next/navigation";
import { listBreweriesForMap } from "@/lib/breweries-repo";
import { getTrailBySlugForMap } from "@/lib/trails-repo";
import { EmbeddedTrailWidget } from "@/components/map/EmbeddedTrailWidget";

export const dynamic = "force-dynamic";

export default async function ThirteenBreweriesTrailArticle() {
  const trail = await getTrailBySlugForMap("13-brauereien-weg");
  if (!trail) notFound();

  const allBreweries = await listBreweriesForMap();
  const trailBreweries = allBreweries.filter((b) => b.trailSlugs.includes(trail.slug));

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-4 text-3xl font-semibold text-neutral-900">{trail.title}</h1>
      <p className="mb-6 text-neutral-700">
        {trail.description ?? "A hike through the Fränkische Schweiz, stopping at village breweries along the way."}
      </p>

      <p className="mb-8 text-neutral-700">
        This is a stand-in for wherever the real blog article content will eventually live — the map widget below
        is the reusable piece: drop <code>{"<EmbeddedTrailWidget trail={...} breweries={...} />"}</code> into any
        article page and it scopes itself to that trail&apos;s breweries and geometry.
      </p>

      <EmbeddedTrailWidget trail={trail} breweries={trailBreweries} />

      <p className="mt-8 text-neutral-700">
        More trail notes, photos, and tasting impressions would continue here in the real article.
      </p>
    </article>
  );
}
