import classNames from "classnames";

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

export function Deck({ deck, cards, isSelected, onClick }: DeckProps) {
  return (
    <div className="perspective-1000 max-w-64 max-h-64">
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "text-white bg-gradient-to-br rounded-lg p-8 text-center cursor-pointer transition-all duration-200 min-h-48 flex flex-col items-center justify-center relative group",
          isSelected
            ? "from-sky-500 to-slate-600 hover:from-sky-600 hover:to-slate-700"
            : "from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700"
        )}
      >
        <div className="flex flex-col items-center space-y-2">
          {deck.lang && (
            <span className="absolute top-2 right-2 rounded w-6 h-4 overflow-hidden">
              <img
                src={`https://www.worldometers.info/img/flags/${deck.lang.toLowerCase()}-flag.gif`}
                alt={deck.lang}
              />
            </span>
          )}
          <p className="text-2xl font-bold">{deck.topic}</p>
          <p className="text-lg font-bold">{cards.length}</p>
        </div>
      </button>
    </div>
  );
}
