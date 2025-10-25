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
      </button>
    </div>
  );
}
