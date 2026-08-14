import { listBreweriesForMap, listRegions } from "@/lib/breweries-repo";
import { listTrailsForMap } from "@/lib/trails-repo";
import { AtlasView } from "@/components/map/AtlasView";

export const dynamic = "force-dynamic";

export default async function FranconiaBreweriesPage() {
  const [breweries, trails, regions] = await Promise.all([
    listBreweriesForMap(),
    listTrailsForMap(),
    listRegions(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-neutral-900">Franconian brewery atlas</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Every brewery I&apos;ve mapped across the region&apos;s hiking trails — my own ratings and notes first,
        Google Maps data second.
      </p>
      <AtlasView breweries={breweries} trails={trails} regions={regions} />
    </div>
  );
}
