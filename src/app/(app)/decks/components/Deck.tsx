import { useTranslations } from "next-intl";
import classNames from "classnames";

import { DeckWithCount } from "../../types/types";

interface DeckProps {
  deck: DeckWithCount;
  isSelected?: boolean;
  onClick?: () => void;
}

export const Deck = ({ deck, isSelected, onClick }: DeckProps) => {
  const t = useTranslations();

  return (
    <div className="perspective-1000 w-full h-full">
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "w-full h-full text-white bg-gradient-to-br rounded-lg p-4 md:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center relative group",
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
          <p className="md:text-lg font-medium">
            {t("cards.withCount", { count: deck.count })}
          </p>
        </div>
      </button>
    </div>
  );
};
