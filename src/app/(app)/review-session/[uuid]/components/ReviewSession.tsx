import { useState } from "react";

import { PlaceholderStateReview } from "../../components/PlaceholderStateReview";
import { StatsPanel } from "./StatsPanel";
import { CardStack } from "./CardStack";

import { ReviewSessionState, ReviewSessionStats } from "../../types";
import { Card } from "@/app/(app)/types/types";

type ReviewSessionProps = {
  cards: Card[];
};

export const ReviewSession = ({ cards }: ReviewSessionProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<ReviewSessionStats>({
    correct: 0,
    incorrect: 0,
    hintUsed: 0,
  });
  const [remainingCount, setRemainingCount] = useState((cards ?? []).length);

  const onActionPerformed = (stats: ReviewSessionStats, remaining: number) => {
    setStats(stats);
    setRemainingCount(remaining);
    if (remaining === 0) {
      setIsComplete(true);
    }
  };

  if (!cards || cards.length === 0) {
    return <PlaceholderStateReview label="No card to review for now" />;
  }

  return (
    <div className="flex flex-col content-stretch gap-2">
      <StatsPanel
        stats={stats}
        remainingCount={remainingCount}
        onRestartClicked={() => alert("Restart not implemented yet!")}
      />

      <div className="w-full flex-1 mt-12">
        {isComplete ? (
          <PlaceholderStateReview label="Review session complete! 🎉" />
        ) : (
          <CardStack cards={cards} onActionPerformed={onActionPerformed} />
        )}
      </div>
    </div>
  );
};
