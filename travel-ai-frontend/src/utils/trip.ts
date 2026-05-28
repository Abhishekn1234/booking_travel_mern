export const textFrom = (value: unknown) => {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return "";
};

export const getTripTitle = (trip?: Record<string, unknown>) => {
  if (!trip) return "Untitled trip";

  const title =
    textFrom(trip.title) ||
    textFrom(trip.tripTitle) ||
    textFrom(trip.destination) ||
    textFrom(trip.location);

  return title || "Untitled trip";
};

export const getTripSummary = (trip?: Record<string, unknown>) => {
  if (!trip) return "AI itinerary details will appear here once parsed.";

  const summary =
    textFrom(trip.summary) ||
    textFrom(trip.description) ||
    textFrom(trip.overview);

  return summary || "Open the trip to review the parsed travel plan.";
};
