import type { Trip, ItineraryDay } from "./types";

/**
 * The voyage. 25 July → 1 August 2026, seven nights along the Dalmatian coast.
 */
export const trip: Trip = {
  title: "QIMO Croatia Experience",
  subtitle: "A private voyage along the Dalmatian coast",
  startDate: "2026-07-25",
  endDate: "2026-08-01",
  dateLabel: "25 Julho — 1 Agosto",
  year: 2026,
  vessel: "M/Y QIMO",
  hero: {
    src: "/images/trip-hero.svg",
    alt: "The Adriatic at first light, seen from the deck of the QIMO",
  },
};

/**
 * Curated daily timeline aboard. Times are local (CEST).
 * These drive the dashboard's "próximos eventos".
 */
export const itinerary: ItineraryDay[] = [
  {
    day: 1,
    date: "2026-07-25",
    destinationSlug: "trogir",
    schedule: [
      { time: "15:00", title: "Embarque", detail: "Welcome aboard · Split / Trogir" },
      { time: "17:00", title: "Champagne sailaway", detail: "Foredeck" },
      { time: "20:00", title: "Welcome Dinner", detail: "Aft deck" },
    ],
  },
  {
    day: 2,
    date: "2026-07-26",
    destinationSlug: "hvar",
    schedule: [
      { time: "08:00", title: "Swim stop", detail: "Pakleni Islands" },
      { time: "13:00", title: "Almoço a bordo" },
      { time: "18:30", title: "Sunset cocktail", detail: "Hvar town" },
      { time: "21:00", title: "Dinner ashore" },
    ],
  },
  {
    day: 3,
    date: "2026-07-27",
    destinationSlug: "korcula",
    schedule: [
      { time: "10:00", title: "Old town walk", detail: "Korčula" },
      { time: "13:00", title: "Swim stop", detail: "Badija" },
      { time: "19:00", title: "Cocktail", detail: "Massimo's tower" },
      { time: "21:00", title: "Dinner" },
    ],
  },
  {
    day: 4,
    date: "2026-07-28",
    destinationSlug: "dubrovnik",
    schedule: [
      { time: "09:30", title: "City walls", detail: "Dubrovnik" },
      { time: "13:00", title: "Lunch ashore" },
      { time: "18:00", title: "Cocktail", detail: "Buža, on the rocks" },
      { time: "20:00", title: "Dinner", detail: "Restaurant 360" },
    ],
  },
  {
    day: 5,
    date: "2026-07-29",
    destinationSlug: "peljesac",
    schedule: [
      { time: "10:00", title: "Vineyard visit", detail: "Dingač" },
      { time: "13:30", title: "Oyster tasting", detail: "Mali Ston" },
      { time: "19:00", title: "Captain's Dinner", detail: "Aboard" },
    ],
  },
  {
    day: 6,
    date: "2026-07-30",
    destinationSlug: "makarska",
    schedule: [
      { time: "09:00", title: "Swim stop", detail: "Below Biokovo" },
      { time: "12:30", title: "Lunch ashore" },
      { time: "18:00", title: "Sunset Party", detail: "Sundeck" },
    ],
  },
  {
    day: 7,
    date: "2026-07-31",
    destinationSlug: "bol",
    schedule: [
      { time: "09:30", title: "Zlatni Rat", detail: "Golden Horn beach" },
      { time: "13:00", title: "Farewell lunch" },
      { time: "19:30", title: "Farewell Dinner", detail: "Aboard" },
    ],
  },
];
