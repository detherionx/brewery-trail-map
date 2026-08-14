"use client";

export type StatusFilter = "all" | "open" | "unvisited" | "visited" | "featured";

const ATLAS_STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All breweries" },
  { value: "open", label: "Open now" },
  { value: "unvisited", label: "Unvisited" },
  { value: "visited", label: "Visited" },
  { value: "featured", label: "Featured" },
];

const EMBEDDED_STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open now" },
  { value: "featured", label: "My favourites" },
];

function StatusChips({
  options,
  value,
  onChange,
}: {
  options: { value: StatusFilter; label: string }[];
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            value === option.value
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function EmbeddedFilterBar({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return <StatusChips options={EMBEDDED_STATUS_OPTIONS} value={value} onChange={onChange} />;
}

export function AtlasFilterBar({
  statusValue,
  onStatusChange,
  trails,
  selectedTrailSlugs,
  onToggleTrail,
  regions,
  selectedRegionSlug,
  onRegionChange,
}: {
  statusValue: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  trails: { slug: string; title: string }[];
  selectedTrailSlugs: string[];
  onToggleTrail: (slug: string) => void;
  regions: { slug: string; name: string }[];
  selectedRegionSlug: string;
  onRegionChange: (slug: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <StatusChips options={ATLAS_STATUS_OPTIONS} value={statusValue} onChange={onStatusChange} />

      {trails.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-3">
          <span className="text-xs font-medium text-neutral-500">Trails:</span>
          {trails.map((trail) => (
            <label key={trail.slug} className="flex items-center gap-1.5 text-xs text-neutral-700">
              <input
                type="checkbox"
                checked={selectedTrailSlugs.includes(trail.slug)}
                onChange={() => onToggleTrail(trail.slug)}
              />
              {trail.title}
            </label>
          ))}
        </div>
      )}

      {regions.length > 1 && (
        <div className="flex items-center gap-2 border-t border-neutral-100 pt-3">
          <label className="text-xs font-medium text-neutral-500" htmlFor="region-select">
            Region:
          </label>
          <select
            id="region-select"
            value={selectedRegionSlug}
            onChange={(e) => onRegionChange(e.target.value)}
            className="input py-1 text-xs"
          >
            <option value="all">All regions</option>
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
