import type { BreweryForMap } from "@/lib/breweries-repo";

export type OpeningStatus = {
  isOpen: boolean | null; // null = unknown, drives grey marker fill
  statusLine: string; // the primary status line shown in the card
  caveat: string | null; // "⚠ Hours occasionally unreliable" style note
};

export function resolveOpeningStatus(brewery: BreweryForMap): OpeningStatus {
  const isOpen = brewery.googleOpenNow;

  let googleLine: string;
  if (isOpen === true) {
    googleLine = "Google Places: Open now";
  } else if (isOpen === false) {
    googleLine = "Google Places: Closed now";
  } else {
    googleLine = brewery.googlePlaceId ? "Google Places: hours unknown (not yet refreshed)" : "Hours unknown";
  }

  const caveatParts: string[] = [];
  if (brewery.openingHoursNote) caveatParts.push(brewery.openingHoursNote);
  if (brewery.openingHoursVerifiedAt) {
    caveatParts.push(`Last personally verified: ${formatDate(brewery.openingHoursVerifiedAt)}`);
  }

  return {
    isOpen,
    statusLine: brewery.openingHoursOverride ?? googleLine,
    caveat: caveatParts.length > 0 ? caveatParts.join(" · ") : null,
  };
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
