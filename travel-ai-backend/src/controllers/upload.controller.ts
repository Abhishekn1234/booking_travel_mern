import { Request, Response } from "express";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

import Booking from "../models/Booking.js";
import Itinerary from "../models/Itinerary.js";

import { extractTextFromFile } from "../services/file.service.js";
import { processItineraryFromText } from "../services/itinerary.service.js";
import { AppError } from "../utils/AppError.js";

const hasUsefulText = (text: string) =>
  text
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "")
    .trim().length > 0;

export const uploadBooking = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 1. Extract text
    const extractedText = await extractTextFromFile(filePath);

    if (!hasUsefulText(extractedText)) {
      throw new AppError(
        "No readable booking text found in the uploaded file. Try uploading a text-based PDF, TXT file, or a clearer image.",
        422
      );
    }

    // 2. AI processing
    const parsedData = await processItineraryFromText(extractedText);

    // 3. Save booking
    const booking = await Booking.create({
      user: req.user?._id,
      fileUrl: `/uploads/${path.basename(filePath)}`,
      extractedText,
      extractedData: parsedData,
    });

    // 4. Save itinerary
    const itinerary = await Itinerary.create({
      user: req.user?._id,
      booking: booking._id,
      itinerary: parsedData,
      shareId: uuidv4(),
    });

    res.status(201).json({
      success: true,
      booking,
      itinerary,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
};
