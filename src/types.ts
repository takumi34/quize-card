export interface Word {
  word: string;
  meaning: string;
  example?: string;
  status?: "unseen" | "correct" | "wrong";
}

export type PageType = "input" | "quiz" | "summary";
