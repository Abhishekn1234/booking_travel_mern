import { Request, Response } from "express";
import Itinerary from "../models/Itinerary.js";

export const getMyItineraries = async (req: Request, res: Response) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user?._id })
      .select("itinerary shareId createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json(itineraries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getItineraryById = async (req: Request, res: Response) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user?._id,
    }).select("itinerary shareId createdAt updatedAt");

    if (!itinerary) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(itinerary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSharedItinerary = async (req: Request, res: Response) => {
  try {
    const itinerary = await Itinerary.findOne({ shareId: req.params.shareId }).select(
      "itinerary shareId createdAt updatedAt"
    );

    if (!itinerary) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(itinerary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
