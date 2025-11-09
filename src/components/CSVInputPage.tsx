import { useState } from "react";
import { parseCSV } from "../utils/csvParser";
import type { Word } from "../types";
import { MAX_WORDS_LIMIT, ICONS } from "../constants";
import { Header } from "./Header";

interface CSVInputPageProps {
  onWordsLoaded: (words: Word[], shuffle?: boolean) => void;
}

export const CSVInputPage: React.FC<CSVInputPageProps> = ({ onWordsLoaded }) => {
  const [csvText, setCsvText] = useState("");
  const [error, setError] = useState("");

  const lineCount = csvText.trim() === "" ? 0 : csvText.trim().split('\n').length;

  const exampleCSV = `apple,りんご,I ate an apple.
run,走る,I run every morning.
book,本,This is a good book.`;

  const handleParse = (shuffle: boolean) => {
    setError("");

    if (!csvText.trim()) {
      setError("Please enter CSV text");
      return;
    }

    const { words, error: parseError } = parseCSV(csvText);

    if (parseError) {
      setError(parseError);
      return;
    }

    if (words.length === 0) {
      setError("No valid words found in CSV");
      return;
    }

    onWordsLoaded(words, shuffle);
  };

  const handleLoadExample = () => {
    setCsvText(exampleCSV);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full fade-in">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Quiz Card
            </h1>
            <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-3 md:mt-4 text-base md:text-lg px-4">Master your vocabulary with interactive flashcards</p>
        </div>

        <div className="glass rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl">
          <div className="mb-4 sm:mb-6">
            <label htmlFor="csv-input" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              {ICONS.PENCIL} Paste CSV Text <span className="text-purple-600">(Max {MAX_WORDS_LIMIT} words)</span>
            </label>
            <textarea
              id="csv-input"
              rows={12}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 font-mono text-xs sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200 hover:border-purple-300 placeholder-gray-300 resize-y"
              placeholder="apple,りんご,I ate an apple.&#10;run,走る,I run every morning.&#10;book,本,This is a good book."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 sm:mt-3">
              <p className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium">Format:</span> word, meaning, example (optional)
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                {lineCount} lines
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl slide-up">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{ICONS.WARNING}</span>
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleParse(true)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 text-sm sm:text-base"
              >
                Start Quiz (Random)
              </button>
              <button
                onClick={() => handleParse(false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base"
              >
                Start Quiz (Order)
              </button>
            </div>
            <button
              onClick={handleLoadExample}
              className="w-full px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-300 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:border-purple-400 shadow-md text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <span>{ICONS.BULB}</span>
                <span>Load Example</span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-block text-left bg-white/50 rounded-lg p-3 sm:p-4 max-w-lg">
            <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <span>{ICONS.INFO}</span>
              <span>How to Use / 使い方</span>
            </h3>
            <div className="space-y-1.5 text-[10px] sm:text-xs text-gray-600">
              <p><span className="font-semibold">1.</span> Paste CSV: word, meaning, example / CSV形式で貼り付け（単語、意味、例文）</p>
              <p><span className="font-semibold">2.</span> Start quiz (random or in order) / クイズを開始（ランダムまたは順序）</p>
              <p><span className="font-semibold">3.</span> Show answer and mark correct/wrong / 答えを表示して正解/不正解をマーク</p>
              <p><span className="font-semibold">4.</span> Review results and retry wrong words / 結果確認と間違えた単語の復習</p>
              <p><span className="font-semibold">5.</span> View all words in CSV format / 全単語をCSV形式で確認可能</p>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full max-w-2xl mt-4">
        <Header />
      </div>
    </div>
  );
};
