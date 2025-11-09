import Papa from "papaparse";
import type { Word } from "../types";
import { MAX_WORDS_LIMIT } from "../constants";

export const sanitizeText = (text: string): string => {
  if (!text) return "";

  const trimmed = text.trim();

  // Prevent CSV formula injection by prefixing with single quote
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }

  return trimmed;
};

export const parseCSV = (csvText: string): { words: Word[]; error?: string } => {
  try {
    // First, try parsing with header
    let result = Papa.parse<{ word: string; meaning: string; example?: string }>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Check if the first row has 'word' and 'meaning' fields
    // If not, it's likely a headerless CSV, so parse without header
    const hasValidHeader = result.data.length > 0 &&
                          ('word' in result.data[0]) &&
                          ('meaning' in result.data[0]);

    if (!hasValidHeader) {
      // Parse without header - treat as array of arrays
      const arrayResult = Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
      });

      if (arrayResult.errors.length > 0) {
        return { words: [], error: "CSV parsing failed: " + arrayResult.errors[0].message };
      }

      const rows = arrayResult.data.slice(0, MAX_WORDS_LIMIT);

      const words: Word[] = rows
        .map((row) => ({
          word: sanitizeText(row[0] || ""),
          meaning: sanitizeText(row[1] || ""),
          example: row[2] ? sanitizeText(row[2]) : undefined,
          status: "unseen" as const,
        }))
        .filter((word) => word.word && word.meaning);

      if (words.length === 0) {
        return { words: [], error: "No valid words found in CSV" };
      }

      return { words };
    }

    // Use the header-parsed result
    if (result.errors.length > 0) {
      return { words: [], error: "CSV parsing failed: " + result.errors[0].message };
    }

    const rows = result.data.slice(0, MAX_WORDS_LIMIT);

    const words: Word[] = rows
      .map((row) => ({
        word: sanitizeText(row.word || ""),
        meaning: sanitizeText(row.meaning || ""),
        example: row.example ? sanitizeText(row.example) : undefined,
        status: "unseen" as const,
      }))
      .filter((word) => word.word && word.meaning);

    if (words.length === 0) {
      return { words: [], error: "No valid words found in CSV" };
    }

    return { words };
  } catch (error) {
    return { words: [], error: "Failed to parse CSV: " + (error as Error).message };
  }
};

export const wordsToCSV = (words: Word[]): string => {
  const rows = words.map((word) => ({
    word: sanitizeText(word.word),
    meaning: sanitizeText(word.meaning),
    example: word.example ? sanitizeText(word.example) : "",
  }));

  return Papa.unparse(rows);
};
