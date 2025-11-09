import { useState } from "react";
import type { Word } from "../types";
import { wordsToCSV } from "../utils/csvParser";
import { Header } from "./Header";

interface SummaryPageProps {
  words: Word[];
  onRestart: () => void;
  onRetryWrong: () => void;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({ words, onRestart, onRetryWrong }) => {
  const [viewMode, setViewMode] = useState<"cards" | "csv">("cards");
  const correctCount = words.filter((w) => w.status === "correct").length;
  const wrongCount = words.filter((w) => w.status === "wrong").length;
  const unseenCount = words.filter((w) => w.status === "unseen").length;

  const handleCopyAllWords = async () => {
    const csv = wordsToCSV(words);

    try {
      await navigator.clipboard.writeText(csv);
      alert(`Copied ${words.length} words to clipboard!`);
    } catch (error) {
      alert("Failed to copy to clipboard: " + (error as Error).message);
    }
  };

  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "correct":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 hover:shadow-lg";
      case "wrong":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-red-300 hover:shadow-lg";
      case "unseen":
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 hover:shadow-lg";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "correct":
        return (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs rounded-full font-semibold shadow-md whitespace-nowrap">
            ✓ Got It!
          </span>
        );
      case "wrong":
        return (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] sm:text-xs rounded-full font-semibold shadow-md whitespace-nowrap">
            ✗ Review
          </span>
        );
      case "unseen":
      default:
        return (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-400 text-white text-[10px] sm:text-xs rounded-full font-semibold shadow-md whitespace-nowrap">
            ⊘ Skipped
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 sm:p-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto fade-in">
        <Header />

        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 px-4">
            Quiz Complete!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-4">Great job! Here's how you did</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-xl slide-up">
            <div className="inline-block">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Overall Accuracy</div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {accuracy}%
              </div>
              <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 w-36 sm:w-48 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <div
                  className="h-1.5 sm:h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-lg slide-up delay-100 card-hover">
              <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">✅</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">Correct</p>
            </div>
            <div className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-lg slide-up delay-200 card-hover">
              <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">❌</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{wrongCount}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">Wrong</p>
            </div>
            <div className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-lg slide-up delay-300 card-hover">
              <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">⊘</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">{unseenCount}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">Skipped</p>
            </div>
            <div className="glass rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-lg slide-up delay-400 card-hover">
              <div className="text-lg sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 md:mb-2">📚</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{words.length}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">Total</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 slide-up delay-500">
          <button
            onClick={onRestart}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm sm:text-base"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🔄</span>
              <span>Start New Quiz</span>
            </span>
          </button>
          {wrongCount > 0 && (
            <button
              onClick={onRetryWrong}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🔁</span>
                <span>Retry Wrong Words</span>
              </span>
            </button>
          )}
        </div>

        <div className="glass rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 slide-up delay-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">📖</span>
              <span>Word Review</span>
            </h2>

            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  viewMode === "cards"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📇 Cards
              </button>
              <button
                onClick={() => setViewMode("csv")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  viewMode === "csv"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📄 CSV
              </button>
            </div>
          </div>

          {viewMode === "cards" ? (
            <div className="space-y-2 sm:space-y-3">
              {words.map((word, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200 ${getStatusColor(
                    word.status
                  )}`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words">{word.word}</span>
                        <div className="flex-shrink-0">
                          {getStatusBadge(word.status)}
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 font-medium mb-1 break-words">{word.meaning}</p>
                      {word.example && (
                        <p className="text-xs sm:text-sm text-gray-600 italic bg-white/50 p-2 rounded-lg mt-1.5 sm:mt-2 break-words">
                          💬 {word.example}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-3">
                <button
                  onClick={handleCopyAllWords}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Copy CSV</span>
                  </span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200">
                <pre className="font-mono text-[10px] sm:text-xs text-gray-800 whitespace-pre-wrap break-words overflow-x-auto">
                  {wordsToCSV(words)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
