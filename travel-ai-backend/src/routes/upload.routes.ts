import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import { uploadBooking } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadBooking);

export default router;