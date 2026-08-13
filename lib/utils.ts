import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a Google Maps directions/search link from coordinates or a query. */
export function googleMapsUrl(opts: { lat?: number; lng?: number; query?: string }) {
  if (opts.lat != null && opts.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${opts.lat},${opts.lng}`;
  }
  const q = encodeURIComponent(opts.query ?? "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Abre o Google Maps já em modo de direções ("como chegar") até o destino. */
export function googleMapsDirectionsUrl(opts: { lat?: number; lng?: number; query?: string }) {
  const dest =
    opts.lat != null && opts.lng != null
      ? `${opts.lat},${opts.lng}`
      : encodeURIComponent(opts.query ?? "");
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}
