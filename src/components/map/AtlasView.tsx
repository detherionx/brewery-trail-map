"use client";

import { useMemo, useState } from "react";
import type { BreweryForMap } from "@/lib/breweries-repo";
import type { TrailForMap } from "@/lib/trails-repo";
import { filterBreweries } from "@/lib/filter-breweries";
import { BreweryMap } from "./BreweryMap";
import { AtlasFilterBar, type StatusFilter } from "./FilterBar";

export function AtlasView({
  breweries,
  trails,
  regions,
}: {
  breweries: BreweryForMap[];
  trails: TrailForMap[];
  regions: { slug: string; name: string }[];
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedTrailSlugs, setSelectedTrailSlugs] = useState<string[]>([]);
  const [regionSlug, setRegionSlug] = useState("all");

  const filtered = useMemo(
    () => filterBreweries(breweries, { status, trailSlugs: selectedTrailSlugs, regionSlug }),
    [breweries, status, selectedTrailSlugs, regionSlug],
  );

  function toggleTrail(slug: string) {
    setSelectedTrailSlugs((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AtlasFilterBar
        statusValue={status}
        onStatusChange={setStatus}
        trails={trails.map((t) => ({ slug: t.slug, title: t.title }))}
        selectedTrailSlugs={selectedTrailSlugs}
        onToggleTrail={toggleTrail}
        regions={regions}
        selectedRegionSlug={regionSlug}
        onRegionChange={setRegionSlug}
      />

      <p className="text-sm text-neutral-500">
        Showing {filtered.length} of {breweries.length} breweries.
      </p>

      <BreweryMap breweries={filtered} className="h-[70vh] w-full rounded-lg" />
    </div>
  );
}
