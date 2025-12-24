type StatProgressBarProps = {
  correct: number;
  incorrect: number;
  hintUsed: number;
  remaining: number;
};

export const StatProgressBar = ({
  correct,
  incorrect,
  hintUsed,
  remaining,
}: StatProgressBarProps) => {
  const total = correct + incorrect + hintUsed + remaining;

  if (total === 0) return null;

  return (
    <div className="w-full h-1 overflow-hidden transition-all bg-stone-400">
      <div className="flex h-full">
        {correct > 0 && (
          <div
            className="bg-emerald-600 transition-all duration-300 ease-in-out"
            style={{ flexBasis: `${(correct / total) * 100}%` }}
          />
        )}
        {incorrect > 0 && (
          <div
            className="bg-red-600 transition-all duration-300 ease-in-out"
            style={{ flexBasis: `${(incorrect / total) * 100}%` }}
          />
        )}
        {hintUsed > 0 && (
          <div
            className="bg-yellow-600"
            style={{ flexBasis: `${(hintUsed / total) * 100}%` }}
          />
        )}
        {remaining > 0 && (
          <div
            className="bg-transparent"
            style={{ flexBasis: `${(remaining / total) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
};
