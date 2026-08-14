import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Admin sign in</h1>
      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="from" value={from ?? "/admin/breweries"} />
        <label className="flex flex-col gap-1 text-sm text-neutral-700">
          Password
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-base outline-none focus:border-neutral-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">Incorrect password.</p>}
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
