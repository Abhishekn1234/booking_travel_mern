import path from "path";
import { readFile } from "node:fs/promises";
import { extractPDFText } from "./pdf.service.js";
import { extractImageText } from "./ocr.service.js";

export const extractTextFromFile = async (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return await extractPDFText(filePath);
  }

  if (ext === ".txt") {
    return await readFile(filePath, "utf8");
  }

  return await extractImageText(filePath);
};
