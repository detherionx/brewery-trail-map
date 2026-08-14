import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const regions = sqliteTable("regions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const breweries = sqliteTable("breweries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  village: text("village").notNull(),
  regionId: integer("region_id")
    .notNull()
    .references(() => regions.id),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  googlePlaceId: text("google_place_id"),

  // editorial content (primary)
  visited: integer("visited", { mode: "boolean" }).notNull().default(false),
  visitedAt: text("visited_at"),
  myRating: real("my_rating"),
  myComment: text("my_comment"),
  recommendationSource: text("recommendation_source"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),

  // Google enrichment (secondary, cached)
  googleRating: real("google_rating"),
  googleRatingCount: integer("google_rating_count"),
  googleMapsUrl: text("google_maps_url"),

  // opening hours
  openingHoursOverride: text("opening_hours_override"),
  openingHoursNote: text("opening_hours_note"),
  openingHoursVerifiedAt: text("opening_hours_verified_at"),
  googleOpeningHoursJson: text("google_opening_hours_json"),
  googleOpenNow: integer("google_open_now", { mode: "boolean" }),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const trails = sqliteTable("trails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  officialSourceUrl: text("official_source_url"),
  distanceKm: real("distance_km"),
  regionId: integer("region_id")
    .notNull()
    .references(() => regions.id),
  geometry: text("geometry"), // GeoJSON LineString, parsed from GPX/KML at import time
});

export const trailBreweries = sqliteTable(
  "trail_breweries",
  {
    trailId: integer("trail_id")
      .notNull()
      .references(() => trails.id),
    breweryId: integer("brewery_id")
      .notNull()
      .references(() => breweries.id),
    sequence: integer("sequence").notNull(),
  },
  (table) => [primaryKey({ columns: [table.trailId, table.breweryId] })],
);

export const recommendations = sqliteTable("recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  breweryId: integer("brewery_id")
    .notNull()
    .references(() => breweries.id),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  comment: text("comment").notNull(),
  addedAt: text("added_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const regionsRelations = relations(regions, ({ many }) => ({
  breweries: many(breweries),
  trails: many(trails),
}));

export const breweriesRelations = relations(breweries, ({ one, many }) => ({
  region: one(regions, { fields: [breweries.regionId], references: [regions.id] }),
  trailBreweries: many(trailBreweries),
  recommendations: many(recommendations),
}));

export const trailsRelations = relations(trails, ({ one, many }) => ({
  region: one(regions, { fields: [trails.regionId], references: [regions.id] }),
  trailBreweries: many(trailBreweries),
}));

export const trailBreweriesRelations = relations(trailBreweries, ({ one }) => ({
  trail: one(trails, { fields: [trailBreweries.trailId], references: [trails.id] }),
  brewery: one(breweries, { fields: [trailBreweries.breweryId], references: [breweries.id] }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  brewery: one(breweries, { fields: [recommendations.breweryId], references: [breweries.id] }),
}));
