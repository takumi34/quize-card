interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">📖</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Question <span className="text-purple-600">{current}</span> of <span className="text-purple-600">{total}</span>
          </span>
        </div>
        <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden shadow-inner">
        <div
          className="h-2 sm:h-2.5 md:h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      {/* Mini milestone indicators */}
      <div className="flex justify-between mt-1 px-0.5 sm:px-1">
        {[25, 50, 75, 100].map((milestone) => (
          <div
            key={milestone}
            className={`text-[10px] sm:text-xs transition-all duration-300 ${
              percentage >= milestone
                ? 'text-purple-600 font-bold scale-110'
                : 'text-gray-400'
            }`}
          >
            {milestone === 100 ? '🎉' : percentage >= milestone ? '✓' : '·'}
          </div>
        ))}
      </div>
    </div>
  );
};
