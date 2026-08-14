import { notFound } from "next/navigation";
import { getBreweryById } from "@/lib/breweries-repo";
import { BreweryForm } from "../BreweryForm";
import { updateBreweryAction } from "../actions";

export default async function EditBreweryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brewery = await getBreweryById(Number(id));
  if (!brewery) notFound();

  const action = updateBreweryAction.bind(null, brewery.id);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">
        Edit {brewery.name} · {brewery.village}
      </h1>
      <BreweryForm
        action={action}
        submitLabel="Save changes"
        initialValues={{
          name: brewery.name,
          village: brewery.village,
          regionName: brewery.region?.name,
          lat: brewery.lat,
          lng: brewery.lng,
          googlePlaceId: brewery.googlePlaceId,
          visited: brewery.visited,
          visitedAt: brewery.visitedAt,
          myRating: brewery.myRating,
          myComment: brewery.myComment,
          recommendationSource: brewery.recommendationSource,
          featured: brewery.featured,
          openingHoursOverride: brewery.openingHoursOverride,
          openingHoursNote: brewery.openingHoursNote,
        }}
      />
    </div>
  );
}
