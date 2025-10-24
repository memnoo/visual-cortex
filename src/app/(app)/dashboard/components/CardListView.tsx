"use client";

interface CardListViewProps {
  cards: any[];
  isVisible: boolean;
  onAddCard?: () => void;
}

export default function CardListView({
  cards,
  isVisible,
  onAddCard,
}: CardListViewProps) {
  if (!isVisible || cards.length === 0) return null;

  // Get all unique content keys from all cards
  const allKeys = Array.from(
    new Set(cards.flatMap((card) => Object.keys(card.content)))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-lime-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-bold">
          Cards in this deck ({cards.length})
        </h3>
        {onAddCard && (
          <button
            onClick={onAddCard}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors"
            title="Add new card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Card
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              {allKeys.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cards.map((card, index) => (
              <tr
                key={card.uuid}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {card.label}
                </td>
                {allKeys.map((key) => (
                  <td
                    key={key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {card.content[key] ? String(card.content[key]) : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
