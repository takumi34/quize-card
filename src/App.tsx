import { useState, useEffect } from "react";
import type { Word, PageType } from "./types";
import { CSVInputPage } from "./components/CSVInputPage";
import { QuizPage } from "./components/QuizPage";
import { SummaryPage } from "./components/SummaryPage";
import { STORAGE_KEY_WORDS, AUTO_FINISH_DELAY } from "./constants";

const isValidWord = (obj: unknown): obj is Word => {
  if (typeof obj !== "object" || obj === null) return false;

  const record = obj as Record<string, unknown>;

  return (
    typeof record.word === "string" &&
    typeof record.meaning === "string" &&
    (record.example === undefined || typeof record.example === "string") &&
    (record.status === undefined || ["unseen", "correct", "wrong"].includes(record.status as string))
  );
};

const validateWords = (data: unknown): Word[] | null => {
  if (!Array.isArray(data) || data.length === 0) return null;
  if (!data.every(isValidWord)) return null;
  return data;
};

function App() {
  const [page, setPage] = useState<PageType>("input");
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedWords = localStorage.getItem(STORAGE_KEY_WORDS);
    if (!savedWords) return;

    try {
      const parsed = JSON.parse(savedWords);
      const validatedWords = validateWords(parsed);

      if (validatedWords) {
        setWords(validatedWords);
      } else {
        localStorage.removeItem(STORAGE_KEY_WORDS);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_WORDS);
    }
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    }
  }, [words]);

  const shuffleArray = (array: Word[]): Word[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleWordsLoaded = (newWords: Word[], shuffle: boolean = true) => {
    const wordsToUse = shuffle ? shuffleArray(newWords) : newWords;
    setWords(wordsToUse);
    setCurrentIndex(0);
    setPage("quiz");
  };

  const handleMarkWord = (status: "correct" | "wrong") => {
    const updatedWords = [...words];
    updatedWords[currentIndex].status = status;
    setWords(updatedWords);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTimeout(() => setPage("summary"), AUTO_FINISH_DELAY);
    }
  };

  const handleMarkCorrect = () => handleMarkWord("correct");
  const handleMarkWrong = () => handleMarkWord("wrong");

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    setPage("summary");
  };

  const handleRestart = () => {
    setWords([]);
    setCurrentIndex(0);
    setPage("input");
    localStorage.removeItem(STORAGE_KEY_WORDS);
  };

  const handleRetryWrong = (shuffle: boolean = true) => {
    const wrongWords = words
      .filter((w) => w.status === "wrong")
      .map((w) => ({ ...w, status: "unseen" as const }));

    if (wrongWords.length > 0) {
      const wordsToUse = shuffle ? shuffleArray(wrongWords) : wrongWords;
      setWords(wordsToUse);
      setCurrentIndex(0);
      setPage("quiz");
    }
  };

  const handleBackToHome = () => {
    setPage("input");
  };

  return (
    <>
      {page === "input" && <CSVInputPage onWordsLoaded={handleWordsLoaded} />}
      {page === "quiz" && (
        <QuizPage
          words={words}
          currentIndex={currentIndex}
          onMarkCorrect={handleMarkCorrect}
          onMarkWrong={handleMarkWrong}
          onNext={handleNext}
          onFinish={handleFinish}
          onBackToHome={handleBackToHome}
        />
      )}
      {page === "summary" && (
        <SummaryPage words={words} onRestart={handleRestart} onRetryWrong={handleRetryWrong} />
      )}
    </>
  );
}

export default App;
