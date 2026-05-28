import OpenAI from "openai";
import "../config/env.js";
import { AppError } from "../utils/AppError.js";

let client: OpenAI | null = null;
type AiProvider = "openai" | "gemini";

const getProvider = (): AiProvider =>
  process.env.AI_PROVIDER === "openai" ? "openai" : "gemini";

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is missing. Add it to travel-ai-backend/.env or set it in the backend process environment."
    );
  }

  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
};

const generateWithGemini = async (prompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new AppError(
      "GEMINI_API_KEY is missing. Add it to travel-ai-backend/.env or set AI_PROVIDER=openai to use OpenAI.",
      500
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";

    if (response.status === 429 || message.toLowerCase().includes("quota")) {
      throw new AppError(
        "Gemini quota exceeded. Check your Google AI Studio billing/quota or use another Gemini API key.",
        402
      );
    }

    throw new AppError(`Gemini request failed: ${message}`, 502);
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
};

const generateWithOpenAI = async (prompt: string) => {
  const res = await getClient().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content || "{}";
};

export const generateItinerary = async (text: string) => {
  const prompt = `
You extract travel booking details from uploaded text.
Return ONLY valid JSON. Do not wrap it in markdown.

If the text is not travel-related or does not contain enough booking details,
return:
{
  "error": "No travel booking details found",
  "days": []
}

Otherwise return this shape. Use specific details from the text. Do not leave
activities, food, and tips all empty if travel details exist.

{
  "title": "Short trip title",
  "destination": "Destination or route",
  "summary": "One sentence summary of the booking",
  "traveler": "Traveler name if present",
  "startDate": "YYYY-MM-DD or original date if unclear",
  "endDate": "YYYY-MM-DD or original date if unclear",
  "days": [
    {
      "day": 1,
      "date": "Date if present",
      "activities": ["Specific flights, hotel check-ins, transfers, events, or booking milestones"],
      "food": ["Meal details if present"],
      "tips": ["Useful reminders based on the booking details"]
    }
  ]
}

Text:
${text}
`;

  try {
    if (getProvider() === "gemini") {
      return await generateWithGemini(prompt);
    }

    return await generateWithOpenAI(prompt);
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    const code = error?.code;
    const status = error?.status;
    const message = error?.message || "";

    if (
      code === "insufficient_quota" ||
      status === 429 ||
      message.toLowerCase().includes("exceeded your current quota")
    ) {
      throw new AppError(
        "OpenAI quota exceeded. Check your OpenAI billing plan or use an API key with available credits.",
        402
      );
    }

    throw new AppError("AI itinerary generation failed. Please try again.", 502);
  }
};
