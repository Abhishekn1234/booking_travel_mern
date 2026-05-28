import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export const extractPDFText = async (filePath: string): Promise<string> => {
  const dataBuffer = await readFile(filePath);

  const parser = new PDFParse({ data: dataBuffer });

  try {
    const data = await parser.getText();
    return data.text ?? "";
  } finally {
    await parser.destroy();
  }
};
