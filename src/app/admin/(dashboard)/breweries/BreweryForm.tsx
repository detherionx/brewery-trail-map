type BreweryFormValues = {
  name?: string;
  village?: string;
  regionName?: string;
  lat?: number;
  lng?: number;
  googlePlaceId?: string | null;
  visited?: boolean;
  visitedAt?: string | null;
  myRating?: number | null;
  myComment?: string | null;
  recommendationSource?: string | null;
  featured?: boolean;
  openingHoursOverride?: string | null;
  openingHoursNote?: string | null;
};

export function BreweryForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initialValues?: BreweryFormValues;
  submitLabel: string;
}) {
  const v = initialValues ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      <fieldset className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input name="name" defaultValue={v.name} required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Village
          <input name="village" defaultValue={v.village} required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Region
          <input name="regionName" defaultValue={v.regionName} required className="input" placeholder="Bamberg" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Google Place ID
          <input name="googlePlaceId" defaultValue={v.googlePlaceId ?? ""} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Latitude
          <input name="lat" type="number" step="any" defaultValue={v.lat} required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Longitude
          <input name="lng" type="number" step="any" defaultValue={v.lng} required className="input" />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-neutral-200 pt-4">
        <legend className="mb-1 text-sm font-medium text-neutral-900">Editorial</legend>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visited" defaultChecked={v.visited} />
            Visited
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={v.featured} />
            Featured
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Visited on
          <input name="visitedAt" type="date" defaultValue={v.visitedAt ?? ""} className="input max-w-xs" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          My rating (0–5, half-star steps)
          <input
            name="myRating"
            type="number"
            min={0}
            max={5}
            step={0.5}
            defaultValue={v.myRating ?? ""}
            className="input max-w-xs"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          My comment
          <textarea name="myComment" defaultValue={v.myComment ?? ""} rows={4} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Recommendation source
          <input
            name="recommendationSource"
            defaultValue={v.recommendationSource ?? ""}
            placeholder="13-brauereien-weg, local-account, friend…"
            className="input"
          />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 border-t border-neutral-200 pt-4">
        <legend className="mb-1 text-sm font-medium text-neutral-900">Opening hours override</legend>
        <label className="flex flex-col gap-1 text-sm">
          Override text
          <input
            name="openingHoursOverride"
            defaultValue={v.openingHoursOverride ?? ""}
            placeholder="Closed Mondays despite Google listing"
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Note
          <input name="openingHoursNote" defaultValue={v.openingHoursNote ?? ""} className="input" />
        </label>
      </fieldset>

      <button
        type="submit"
        className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
