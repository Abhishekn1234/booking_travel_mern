import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const BACKEND_ROOT = path.resolve(__dirname, "../..");
export const UPLOAD_DIR = path.join(BACKEND_ROOT, "uploads");
