import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  getMyItineraries,
  getItineraryById,
  getSharedItinerary,
} from "../controllers/itinerary.controller.js";

const router = express.Router();

router.get("/", protect, getMyItineraries);

router.get("/share/:shareId", getSharedItinerary);

router.get("/:id", protect, getItineraryById);

export default router;
