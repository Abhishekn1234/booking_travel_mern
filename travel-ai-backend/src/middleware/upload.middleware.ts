import multer from "multer";

import path from "path";
import { mkdirSync } from "node:fs";
import { UPLOAD_DIR } from "../config/paths.js";
import { AppError } from "../utils/AppError.js";

mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
