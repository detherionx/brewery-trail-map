"use client";

import { useMemo, useState } from "react";
import type { BreweryForMap } from "@/lib/breweries-repo";
import type { TrailForMap } from "@/lib/trails-repo";
import { filterBreweries } from "@/lib/filter-breweries";
import { BreweryMap } from "./BreweryMap";
import { EmbeddedFilterBar, type StatusFilter } from "./FilterBar";

export function EmbeddedTrailWidget({ trail, breweries }: { trail: TrailForMap; breweries: BreweryForMap[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(
    () => filterBreweries(breweries, { status, trailSlugs: [], regionSlug: "all" }),
    [breweries, status],
  );

  const visitedCount = breweries.filter((b) => b.visited).length;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">{trail.title}</p>

      <BreweryMap
        breweries={filtered}
        trailGeometry={trail.geometry}
        className="h-80 w-full rounded-md"
        defaultZoom={13}
      />

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0057b8]" /> Open now
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-neutral-400" /> Closed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-white bg-neutral-700" /> Visited by
          me
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-neutral-700">
        <span>
          {visitedCount} / {breweries.length} visited
        </span>
        {trail.distanceKm != null && <span>{trail.distanceKm} km trail</span>}
      </div>

      <div className="mt-3">
        <EmbeddedFilterBar value={status} onChange={setStatus} />
      </div>
    </div>
  );
}
