interface DeckProps {
  deck: {
    uuid: string;
    topic: string;
    count: number;
    lang?: string;
  };
  cards: any[];
  isSelected?: boolean;
  onClick?: () => void;
}

export function Deck({ deck, cards, isSelected = false, onClick }: DeckProps) {
  return (
    <div className="perspective-1000 w-full max-w-md mx-auto h-64">
      <button
        type="button"
        onClick={onClick}
        className={`text-white bg-gradient-to-br from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 min-h-48 flex flex-col items-center justify-center relative group ${
          isSelected ? "ring-2 ring-green-500 ring-offset-2" : ""
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <p className="text-2xl font-bold">{deck.topic}</p>
          <p className="text-lg font-bold">{cards.length}</p>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}
