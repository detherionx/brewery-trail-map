import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Franconian Brewery Trail Map</h1>
      <p className="text-neutral-600">Development entry points:</p>
      <ul className="flex flex-col gap-2 text-blue-600">
        <li>
          <Link href="/franconia/breweries" className="hover:underline">
            Full atlas — /franconia/breweries
          </Link>
        </li>
        <li>
          <Link href="/blog/13-brauereien-weg" className="hover:underline">
            Embedded demo article — /blog/13-brauereien-weg
          </Link>
        </li>
        <li>
          <Link href="/admin/breweries" className="hover:underline">
            Admin — /admin/breweries
          </Link>
        </li>
      </ul>
    </div>
  );
}
