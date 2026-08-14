import type { BreweryForMap } from "@/lib/breweries-repo";
import { resolveOpeningStatus } from "@/lib/opening-status";
import type { StatusFilter } from "@/components/map/FilterBar";

export function filterBreweries(
  breweries: BreweryForMap[],
  filters: { status: StatusFilter; trailSlugs: string[]; regionSlug: string },
): BreweryForMap[] {
  return breweries.filter((brewery) => {
    if (filters.status === "open" && resolveOpeningStatus(brewery).isOpen !== true) return false;
    if (filters.status === "unvisited" && brewery.visited) return false;
    if (filters.status === "visited" && !brewery.visited) return false;
    if (filters.status === "featured" && !brewery.featured) return false;

    if (filters.trailSlugs.length > 0 && !brewery.trailSlugs.some((slug) => filters.trailSlugs.includes(slug))) {
      return false;
    }

    if (filters.regionSlug !== "all" && brewery.region.slug !== filters.regionSlug) return false;

    return true;
  });
}
