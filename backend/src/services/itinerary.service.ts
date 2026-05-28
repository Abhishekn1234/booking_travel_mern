import { generateItinerary } from "./ai.service.js";
import { AppError } from "../utils/AppError.js";

type ParsedTrip = {
  error?: string;
  days?: unknown;
};

const listHasItems = (value: unknown) =>
  Array.isArray(value) && value.some((item) => String(item).trim().length > 0);

const hasUsefulItinerary = (trip: ParsedTrip) => {
  if (!Array.isArray(trip.days) || trip.days.length === 0) return false;

  return trip.days.some((day) => {
    if (!day || typeof day !== "object") return false;

    const record = day as Record<string, unknown>;

    return (
      listHasItems(record.activities) ||
      listHasItems(record.food) ||
      listHasItems(record.tips)
    );
  });
};

export const processItineraryFromText = async (text: string) => {
  const aiResponse = await generateItinerary(text);

  const clean = aiResponse.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean) as ParsedTrip;

    if (parsed.error || !hasUsefulItinerary(parsed)) {
      throw new AppError(
        "No travel booking details found in the uploaded file. Try a flight, hotel, train, or booking confirmation document.",
        422
      );
    }

    return parsed;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    return {
      days: [],
      error: "Invalid AI response",
    };
  }
};
