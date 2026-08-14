import Link from "next/link";
import { listBreweriesWithRegion } from "@/lib/breweries-repo";

export default async function AdminBreweriesPage() {
  const breweryList = await listBreweriesWithRegion();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Breweries</h1>
        <Link
          href="/admin/breweries/new"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Add brewery
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Village</th>
              <th className="px-4 py-2 font-medium">Region</th>
              <th className="px-4 py-2 font-medium">Visited</th>
              <th className="px-4 py-2 font-medium">My rating</th>
              <th className="px-4 py-2 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {breweryList.map((brewery) => (
              <tr key={brewery.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <Link href={`/admin/breweries/${brewery.id}`} className="font-medium text-neutral-900 hover:underline">
                    {brewery.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">{brewery.village}</td>
                <td className="px-4 py-2 text-neutral-600">{brewery.region?.name}</td>
                <td className="px-4 py-2">{brewery.visited ? "✓" : "—"}</td>
                <td className="px-4 py-2">{brewery.myRating ?? "—"}</td>
                <td className="px-4 py-2">{brewery.featured ? "★" : "—"}</td>
              </tr>
            ))}
            {breweryList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  No breweries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
