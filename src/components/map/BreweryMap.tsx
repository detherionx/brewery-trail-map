"use client";

import { useMemo, useState } from "react";
import { APIProvider, Map, Polyline } from "@vis.gl/react-google-maps";
import type { BreweryForMap } from "@/lib/breweries-repo";
import { BreweryMarker } from "./BreweryMarker";
import { BreweryCard } from "./BreweryCard";

const FRANCONIA_CENTER = { lat: 49.9, lng: 11.1 };

export function BreweryMap({
  breweries,
  trailGeometry,
  className,
  defaultZoom = 12,
}: {
  breweries: BreweryForMap[];
  trailGeometry?: GeoJSON.LineString | null;
  className?: string;
  defaultZoom?: number;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = breweries.find((b) => b.id === selectedId) ?? null;

  const center = useMemo(() => {
    if (breweries.length === 0) return FRANCONIA_CENTER;
    const avgLat = breweries.reduce((sum, b) => sum + b.lat, 0) / breweries.length;
    const avgLng = breweries.reduce((sum, b) => sum + b.lng, 0) / breweries.length;
    return { lat: avgLat, lng: avgLng };
  }, [breweries]);

  const path = useMemo(
    () => trailGeometry?.coordinates.map(([lng, lat]) => ({ lat, lng })),
    [trailGeometry],
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

  if (!apiKey) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-neutral-100 p-6 text-center text-sm text-neutral-500 ${className ?? ""}`}
      >
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local to render the map.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["marker"]}>
      <Map
        className={className}
        defaultCenter={center}
        defaultZoom={defaultZoom}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={() => setSelectedId(null)}
      >
        {path && path.length > 1 && (
          <Polyline path={path} strokeColor="#0057b8" strokeOpacity={0.7} strokeWeight={4} />
        )}

        {breweries.map((brewery) => (
          <BreweryMarker
            key={brewery.id}
            brewery={brewery}
            selected={brewery.id === selectedId}
            onSelect={() => setSelectedId(brewery.id)}
          />
        ))}

        {selected && <BreweryCard brewery={selected} onClose={() => setSelectedId(null)} />}
      </Map>
    </APIProvider>
  );
}
