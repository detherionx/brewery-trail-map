"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createBrewery, updateBrewery, type BreweryInput } from "@/lib/breweries-repo";

function parseInput(formData: FormData): BreweryInput {
  const myRatingRaw = String(formData.get("myRating") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    village: String(formData.get("village") ?? "").trim(),
    regionName: String(formData.get("regionName") ?? "").trim(),
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
    googlePlaceId: String(formData.get("googlePlaceId") ?? "").trim() || undefined,
    visited: formData.get("visited") === "on",
    visitedAt: String(formData.get("visitedAt") ?? "").trim() || undefined,
    myRating: myRatingRaw ? Number(myRatingRaw) : undefined,
    myComment: String(formData.get("myComment") ?? "").trim() || undefined,
    recommendationSource: String(formData.get("recommendationSource") ?? "").trim() || undefined,
    featured: formData.get("featured") === "on",
    openingHoursOverride: String(formData.get("openingHoursOverride") ?? "").trim() || undefined,
    openingHoursNote: String(formData.get("openingHoursNote") ?? "").trim() || undefined,
  };
}

export async function createBreweryAction(formData: FormData) {
  const input = parseInput(formData);
  await createBrewery(input);
  revalidatePath("/admin/breweries");
  revalidatePath("/franconia/breweries");
  redirect("/admin/breweries");
}

export async function updateBreweryAction(id: number, formData: FormData) {
  const input = parseInput(formData);
  await updateBrewery(id, input);
  revalidatePath("/admin/breweries");
  revalidatePath("/franconia/breweries");
  redirect("/admin/breweries");
}
