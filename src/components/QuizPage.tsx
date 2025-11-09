import { useState } from 'react'
import type { Word } from '../types'
import { ProgressBar } from './ProgressBar'
import { Header } from './Header'

interface QuizPageProps {
  words: Word[]
  currentIndex: number
  onMarkCorrect: () => void
  onMarkWrong: () => void
  onNext: () => void
  onFinish: () => void
  onBackToHome: () => void
}

export const QuizPage: React.FC<QuizPageProps> = ({
  words,
  currentIndex,
  onMarkCorrect,
  onMarkWrong,
  onNext,
  onFinish,
  onBackToHome,
}) => {
  const [showAnswer, setShowAnswer] = useState(false)
  const currentWord = words[currentIndex]
  const isLastWord = currentIndex === words.length - 1

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleMark = (markFn: () => void) => {
    markFn()
    if (!isLastWord) {
      setShowAnswer(false)
    }
  }

  const handleCorrect = () => handleMark(onMarkCorrect)
  const handleWrong = () => handleMark(onMarkWrong)

  const handleNext = () => {
    if (isLastWord) {
      onFinish()
    } else {
      onNext()
      setShowAnswer(false)
    }
  }

  if (!currentWord) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-3 sm:p-4 py-6 sm:py-8">
      <div className="max-w-4xl w-full fade-in">
        <ProgressBar current={currentIndex + 1} total={words.length} />

        <div
          className={`flip-card ${showAnswer ? 'flip-card-flipped' : ''} mb-4 sm:mb-6`}
        >
          <div className="flip-card-inner relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
            <div className="flip-card-front absolute inset-0">
              <div className="glass rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col items-center justify-center">
                <div className="text-center w-full">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-10 sm:mb-14 md:mb-16 break-words px-2">
                    {currentWord.word}
                  </h2>
                  {!showAnswer && (
                    <button
                      onClick={handleShowAnswer}
                      className="group px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 text-base sm:text-lg"
                    >
                      <span className="flex items-center gap-2 sm:gap-3">
                        <span>Show Answer</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flip-card-back absolute inset-0">
              <div className="glass rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col justify-center">
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 sm:mb-8 break-words px-2">
                    {currentWord.meaning}
                  </p>

                  {currentWord.example && (
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/60 rounded-xl max-w-2xl mx-auto">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">
                        💬 Example
                      </p>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 italic leading-relaxed break-words">
                        {currentWord.example}
                      </p>
                    </div>
                  )}
                </div>

                {showAnswer && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 scale-in">
                    <button
                      onClick={handleCorrect}
                      className="flex-1 px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base sm:text-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl sm:text-2xl">✓</span>
                        <span>I Got It!</span>
                      </span>
                    </button>
                    <button
                      onClick={handleWrong}
                      className="flex-1 px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base sm:text-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl sm:text-2xl">✗</span>
                        <span>Not Yet</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={onBackToHome}
            className="glass px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-medium hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-300 text-sm sm:text-base"
          >
            Back to Home
          </button>

          <button
            onClick={handleNext}
            className="glass px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              {isLastWord ? (
                <>
                  <span>🎉</span>
                  <span>Finish Quiz</span>
                </>
              ) : (
                <>
                  <span>Skip</span>
                  <span>→</span>
                </>
              )}
            </span>
          </button>

          {!isLastWord && (
            <button
              onClick={onFinish}
              className="glass px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-medium hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-300 text-sm sm:text-base"
            >
              End Quiz
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mt-4">
        <Header />
      </div>
    </div>
  )
}
