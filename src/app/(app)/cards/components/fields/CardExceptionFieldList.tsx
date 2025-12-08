export const CardExceptionFieldList = ({ values }: { values: unknown[] }) => (
  <div className="flex flex-col content-stretch gap-1">
    {values.map((value) => (
      <small className="italic text-gray-100 font-medium">
        ({String(value)})
      </small>
    ))}
  </div>
);
