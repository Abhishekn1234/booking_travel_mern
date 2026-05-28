import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import itineraryRoutes from "./routes/itinerary.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { UPLOAD_DIR } from "./config/paths.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://booking-travel-mern.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use("/api", apiLimiter);

app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/itinerary", itineraryRoutes);

app.use(errorHandler);

export default app;