export type SwipeDirection = "right" | "left" | "up" | "down";

export interface SwipeAction {
  direction: SwipeDirection;
  label: string;
  color: string;
  icon: string;
}

export const SWIPE_ACTIONS: Record<SwipeDirection, SwipeAction> = {
  right: {
    direction: "right",
    label: "Got it",
    color: "text-green-500",
    icon: "✓",
  },
  left: {
    direction: "left",
    label: "IDK",
    color: "text-red-500",
    icon: "✗",
  },
  up: {
    direction: "up",
    label: "Hint",
    color: "text-yellow-500",
    icon: "💡",
  },
  down: {
    direction: "down",
    label: "Pass",
    color: "text-gray-500",
    icon: "↓",
  },
};
