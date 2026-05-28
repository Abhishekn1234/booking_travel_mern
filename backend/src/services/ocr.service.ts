import Tesseract from "tesseract.js";

export const extractImageText = async (filePath: string): Promise<string> => {
  const result = await Tesseract.recognize(filePath, "eng");

  return result.data.text;
};