/** REVIEW SESSION */

export type ReviewSessionStats = {
  correct: number;
  incorrect: number;
  hintUsed: number;
};

export type ReviewSessionState = {
  remaining: number;
  startTimestamp: number;
  endTimestamp: number;
} & ReviewSessionStats;

/** SWIPE */

export type SwipeDirection = "right" | "left" | "up" | "down";
