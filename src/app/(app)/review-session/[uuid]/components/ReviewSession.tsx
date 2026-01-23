import { useState } from "react";

import { PlaceholderStateReview } from "../../components/PlaceholderStateReview";
import { StatsPanel } from "./StatsPanel";
import { CardStack } from "./CardStack";

import { ReviewSessionStats } from "../../types";
import { Card } from "@/app/(app)/types/types";

type ReviewSessionProps = {
  cards: Card[];
};

export const DEFAULT_STATS: Readonly<ReviewSessionStats> = {
  correct: 0,
  incorrect: 0,
  hintUsed: 0,
};

export const ReviewSession = ({ cards }: ReviewSessionProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<ReviewSessionStats>(DEFAULT_STATS);
  const [remainingCount, setRemainingCount] = useState((cards ?? []).length);
  const [sessionKey, setSessionKey] = useState(crypto.randomUUID());

  const onActionPerformed = (stats: ReviewSessionStats, remaining: number) => {
    setStats(stats);
    setRemainingCount(remaining);
    if (remaining === 0) {
      setIsComplete(true);
    }
  };

  const onRestartClicked = () => {
    setIsComplete(false);
    setStats(DEFAULT_STATS);
    setRemainingCount((cards ?? []).length);
    setSessionKey(() => crypto.randomUUID());
  };

  if (!cards || cards.length === 0) {
    return <PlaceholderStateReview label="No card to review for now" />;
  }

  return (
    <div className="flex flex-col content-stretch gap-2">
      <StatsPanel
        stats={stats}
        remainingCount={remainingCount}
        onRestartClicked={onRestartClicked}
      />

      <div className="w-full flex-1 mt-12">
        {isComplete ? (
          <PlaceholderStateReview label="Review session complete! 🎉" />
        ) : (
          <CardStack
            key={sessionKey}
            cards={cards.sort(() => Math.random() - 0.5)}
            onActionPerformed={onActionPerformed}
          />
        )}
      </div>
    </div>
  );
};
