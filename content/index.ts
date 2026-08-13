/**
 * Content layer barrel — the single import surface for the UI.
 *
 * The UI never imports raw data files directly; it imports from "@/content".
 * When migrating to Supabase/Sanity, only this file and the data modules
 * change (becoming async fetchers); the component layer stays untouched.
 */
export * from "./types";
export { trip, itinerary } from "./trip";
export { destinations, getDestination, destinationSlugs } from "./destinations";
export {
  restaurants,
  getRestaurant,
  getRestaurantsForDestination,
  restaurantCategories,
} from "./restaurants";
export { wineRegions, getWineRegion, grapeVarieties } from "./wines";
export { conciergeSections, checklist, experiences } from "./concierge";
export { glossary, shopping } from "./sabores";
export { offers, getFeaturedOffer } from "./ofertas";
export { tips } from "./tips";
