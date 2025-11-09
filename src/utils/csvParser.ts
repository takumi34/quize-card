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

// Convert parsed rows to Word objects
const convertToWords = (rows: Array<string[] | { word?: string; meaning?: string; example?: string }>): Word[] => {
  return rows
    .map((row) => {
      const word = Array.isArray(row) ? row[0] : row.word;
      const meaning = Array.isArray(row) ? row[1] : row.meaning;
      const example = Array.isArray(row) ? row[2] : row.example;

      return {
        word: sanitizeText(word || ""),
        meaning: sanitizeText(meaning || ""),
        example: example ? sanitizeText(example) : undefined,
        status: "unseen" as const,
      };
    })
    .filter((word) => word.word && word.meaning);
};

export const parseCSV = (csvText: string): { words: Word[]; error?: string } => {
  try {
    // First, try parsing with header
    const result = Papa.parse<{ word: string; meaning: string; example?: string }>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Check if the first row has valid 'word' and 'meaning' fields
    // Exclude actual header row (when word field contains "word")
    const hasValidHeader = result.data.length > 0 &&
                          ('word' in result.data[0]) &&
                          ('meaning' in result.data[0]) &&
                          result.data[0].word !== undefined &&
                          result.data[0].meaning !== undefined &&
                          result.data[0].word.toLowerCase() !== 'word';

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
      const words = convertToWords(rows);

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
    const words = convertToWords(rows);

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
