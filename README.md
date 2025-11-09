# Vocabulary Quiz App

A client-side vocabulary quiz application built with React, TypeScript, and TailwindCSS. Practice vocabulary with flashcard-style quizzes using CSV input.

## Features

- **CSV Input**: Paste CSV text (word, meaning, example) with or without headers
- **Dual Quiz Modes**: Start quiz in random order or sequential order
- **Flashcard Interface**: Flip cards to reveal answers with "Show Answer" button
- **Answer Tracking**: Mark answers as correct or wrong
- **Progress Tracking**: Visual progress bar throughout the quiz
- **Flexible Navigation**: Back to Home or End Quiz early options
- **Retry Wrong Words**: Practice incorrect answers in random or sequential order
- **Dual View Modes**: View results as cards or CSV format
- **CSV Export**: Copy all words or wrong words as CSV
- **Row Counter**: Real-time display of CSV row count
- **Local Storage**: Automatic progress saving

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## CSV Format

```csv
apple,りんご,I ate an apple.
run,走る,I run every morning.
book,本,This is a good book.
```

- **word**: First column (required)
- **meaning**: Second column (required)
- **example**: Third column (optional)
- Header row is optional and automatically detected
- Maximum 100 words per quiz

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS 4**: Styling with @tailwindcss/postcss
- **PapaParse**: CSV parsing library
- **GitHub Pages**: Static hosting

## Architecture

### Application Structure

```
src/
├── components/
│   ├── CSVInputPage.tsx    # CSV input with row counter
│   ├── QuizPage.tsx        # Flashcard quiz interface
│   ├── SummaryPage.tsx     # Results with dual view modes
│   ├── ProgressBar.tsx     # Quiz progress indicator
│   └── Header.tsx          # Footer with attribution
├── utils/
│   └── csvParser.ts        # CSV parsing and sanitization
├── types.ts                # TypeScript type definitions
├── constants.ts            # App constants and icons
├── App.tsx                 # Main app with state management
├── main.tsx                # React entry point
└── index.css               # TailwindCSS imports and custom styles
```

### Component Flow

```
App (State Container)
├── CSVInputPage → Parse CSV → Load Words
├── QuizPage → Mark Answers → Update State
└── SummaryPage → View Results → Retry/Restart
```

### State Management

- **Page State**: Controls current view (input, quiz, summary)
- **Words State**: Array of vocabulary with status tracking
- **Current Index**: Tracks position in quiz
- **Local Storage**: Persists words between sessions

### Data Flow

1. **Input Phase**: User pastes CSV → Parser validates → Words loaded
2. **Quiz Phase**: Show word → Flip card → Mark answer → Next word
3. **Summary Phase**: Display results → Filter wrong words → Retry/Restart

## License

MIT
