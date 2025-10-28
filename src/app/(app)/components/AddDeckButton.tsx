import classNames from "classnames";

type Props = {
  onClick: () => void;
};

export const AddDeckButton = ({ onClick }: Props) => {
  return (
    <div className="max-w-64 max-h-64">
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "text-white bg-gray-100 rounded-lg p-4 md:p-8 text-center cursor-pointer transition-all duration-200 md:min-h-48 flex flex-col items-center justify-center border border-gray-300 border-2 border-dashed"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl md:text-2xl font-bold text-gray-400">
            Créer un deck
          </p>
        </div>
      </button>
    </div>
  );
};
