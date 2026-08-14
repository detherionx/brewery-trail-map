"use client";

import { InfoWindow } from "@vis.gl/react-google-maps";
import type { BreweryForMap } from "@/lib/breweries-repo";
import { resolveOpeningStatus } from "@/lib/opening-status";

export function BreweryCard({ brewery, onClose }: { brewery: BreweryForMap; onClose: () => void }) {
  const { isOpen, statusLine, caveat } = resolveOpeningStatus(brewery);

  return (
    <InfoWindow
      position={{ lat: brewery.lat, lng: brewery.lng }}
      onCloseClick={onClose}
      maxWidth={320}
    >
      <div className="flex flex-col gap-2 py-1 text-sm">
        <div>
          <p className="font-semibold text-neutral-900">
            {brewery.name} · {brewery.village}
          </p>
          {brewery.myRating != null && (
            <p className="text-amber-600">
              {"★".repeat(Math.round(brewery.myRating))} {brewery.myRating.toFixed(1)} — my rating
            </p>
          )}
          {brewery.googleRating != null && (
            <p className="text-neutral-500">
              Google: {brewery.googleRating.toFixed(1)}
              {brewery.googleRatingCount != null ? ` · ${brewery.googleRatingCount} ratings` : ""}
            </p>
          )}
          <p className={isOpen ? "text-blue-700" : "text-neutral-500"}>
            {isOpen === true ? "🟦" : isOpen === false ? "⬜" : "⬜"} {statusLine}
          </p>
          {caveat && <p className="text-xs text-amber-700">⚠ {caveat}</p>}
        </div>

        {brewery.myComment ? (
          <blockquote className="border-l-2 border-neutral-300 pl-2 italic text-neutral-700">
            &ldquo;{brewery.myComment}&rdquo;
          </blockquote>
        ) : (
          <p className="italic text-neutral-400">No notes yet.</p>
        )}

        <p className="text-xs text-neutral-500">
          {[
            brewery.recommendationSource,
            brewery.visitedAt &&
              `Visited ${new Date(brewery.visitedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <div className="flex gap-3 text-xs">
          {!brewery.myComment && (
            <a href={`/admin/breweries/${brewery.id}`} className="text-blue-600 hover:underline">
              Add a note →
            </a>
          )}
          {brewery.googleMapsUrl && (
            <a href={brewery.googleMapsUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              Open in Google Maps →
            </a>
          )}
        </div>
      </div>
    </InfoWindow>
  );
}
