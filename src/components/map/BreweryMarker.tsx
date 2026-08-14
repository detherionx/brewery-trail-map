"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { BreweryForMap } from "@/lib/breweries-repo";
import { resolveOpeningStatus } from "@/lib/opening-status";

const OPEN_COLOR = "#0057b8"; // Bavarian blue
const CLOSED_COLOR = "#9ca3af"; // grey (closed/unknown)
const VISITED_RING = "#ffffff";

export function BreweryMarker({
  brewery,
  selected,
  onSelect,
}: {
  brewery: BreweryForMap;
  selected: boolean;
  onSelect: () => void;
}) {
  const { isOpen } = resolveOpeningStatus(brewery);
  const background = isOpen ? OPEN_COLOR : CLOSED_COLOR;

  return (
    <AdvancedMarker
      position={{ lat: brewery.lat, lng: brewery.lng }}
      onClick={onSelect}
      title={`${brewery.name} · ${brewery.village}`}
      zIndex={selected ? 10 : brewery.visited ? 5 : 1}
    >
      <Pin
        background={background}
        borderColor={brewery.visited ? VISITED_RING : background}
        glyphColor="#ffffff"
        scale={selected ? 1.35 : 1}
      />
    </AdvancedMarker>
  );
}
