export const CardVisibleExtraFieldList = ({
  values,
}: {
  values: [string, unknown][];
}) => (
  <div className="flex flex-col content-stretch gap-1 overflow-x-auto px-4">
    {values.map(([key, value]) => (
      <p key={key} className="flex items-center gap-2 capitalize text-small">
        <span className="text-xs text-gray-300">
          {key.replaceAll("_", " ")}
        </span>
        <span className="capitalize text-white font-bold">{String(value)}</span>
      </p>
    ))}
  </div>
);
