import classNames from "classnames";
import { Deck as DeckModel } from "../types/types";

interface DeckProps {
  deck: DeckModel;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Deck({ deck, isSelected, onClick }: DeckProps) {
  return (
    <div className="perspective-1000 max-w-64 max-h-64">
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "text-white bg-gradient-to-br rounded-lg p-4 md:p-8 text-center cursor-pointer transition-all duration-200 md:min-h-48 flex flex-col items-center justify-center relative group",
          isSelected
            ? "from-sky-500 to-slate-600 hover:from-sky-600 hover:to-slate-700"
            : "from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {deck.lang && (
            <span className="absolute hidden md:visible top-2 right-2 rounded w-6 h-4 overflow-hidden border border-white shadow-lg">
              <img
                src={`https://www.worldometers.info/img/flags/${deck.lang.toLowerCase()}-flag.gif`}
                alt={deck.lang}
              />
            </span>
          )}
          <p className="text-xl md:text-2xl font-bold">{deck.topic}</p>
          <p className="md:text-lg font-bold">{deck.count}</p>
        </div>
      </button>
    </div>
  );
}
