# Franconian Brewery Trail Map

Personal travel-blog feature: an interactive map of Franconian breweries across hiking trails
(13-Brauereien-Weg, Aufseß, Bamberg city, and custom recommendations), built around my own
ratings, comments, and visit history. Google Maps is infrastructure/enrichment, not the content.

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # then fill in the values below
pnpm db:push                       # creates data/brewery.db with all tables
pnpm seed                          # inserts sample regions/breweries/trails for local dev
pnpm dev
```

Open:
- `/franconia/breweries` — full atlas, all trails + filters
- `/blog/13-brauereien-weg` — demo article showing the embedded, trail-scoped widget
- `/admin/breweries` — editorial admin (password-gated)

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps JavaScript API key. Without it, the map renders a placeholder instead of failing. |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Required for `AdvancedMarkerElement`. Create one under Google Cloud Console → Maps Platform → Map Management. Falls back to Google's public `DEMO_MAP_ID` for local testing (limited styling, not for production). |
| `GOOGLE_PLACES_API_KEY` | Server-only key used by `pnpm refresh:google` to pull cached rating/opening-hours data (Places API (New)). |
| `ADMIN_PASSWORD` | Shared password gating `/admin/*`. |
| `ADMIN_SESSION_SECRET` | Random secret signing the admin session cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `DATABASE_PATH` | Defaults to `./data/brewery.db`. |

## Scripts

- `pnpm db:push` / `pnpm db:generate` / `pnpm db:studio` — Drizzle schema push/migration-generate/studio.
- `pnpm seed` — inserts sample regions, breweries, and trails (idempotent-unsafe; run once against a fresh DB).
- `pnpm import:trail <trail-slug> <path-to-file.gpx|.kml>` — parses a GPX/KML file into a GeoJSON
  `LineString` and stores it on `trails.geometry`. The trail row must already exist (e.g. via `pnpm seed`).
  No real trail files are bundled — supply your own for 13-Brauereien-Weg and Aufseß.
- `pnpm refresh:google` — pulls `rating` / `userRatingCount` / `googleMapsUri` / `currentOpeningHours`
  from Places API (New) for every brewery with a `google_place_id`, and writes them into the cached
  `google_*` columns. Never touches editorial fields (`my_rating`, `my_comment`, etc.). Not run
  automatically — call it manually or on a schedule.

## Data model

See `src/db/schema.ts` for the full Drizzle schema: `regions`, `breweries`, `trails`,
`trail_breweries` (join table with `sequence`), and `recommendations` (triage inbox, separate from
a brewery's own `my_comment`).

## Marker visual language

- Fill color: Bavarian blue = open now, grey = closed/unknown (`google_open_now`, refreshed via
  `pnpm refresh:google`, overridable per-brewery via `opening_hours_override`/`opening_hours_note`
  shown in the info card).
- White ring = visited by me.
- Click enlarges the marker (selected state) rather than changing its color language.
- Featured star is deferred to phase 2, as is the screenshot → candidate-brewery ingestion
  pipeline, opening-hours staleness UI, and any public-facing rating/comment submission.

## Admin

`/admin/*` is gated by a single shared password (`ADMIN_PASSWORD`) via `src/middleware.ts` — an
httpOnly signed cookie, not a full auth system. Good enough for a single-editor personal blog;
revisit if this ever needs multiple editors or public-facing submissions.
