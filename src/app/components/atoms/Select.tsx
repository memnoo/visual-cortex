import { useState } from "react";

export type SelectProps = {
  label?: string;
  values: { label: string | number; value: string | number }[];
  onChange: (newValue: (string | number) | (string | number)[]) => void;
  isDisabled: boolean;
  isMultiple: boolean;
  defaultValue?: string | number;
};

export const Select = ({
  label,
  values,
  onChange,
  isDisabled = false,
  isMultiple = false,
  defaultValue = undefined,
}: SelectProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const onValuesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (isMultiple) {
      if (selectedValues.includes(newValue)) {
        setSelectedValues(selectedValues.filter((v) => v !== newValue));
      } else {
        setSelectedValues([...selectedValues, newValue]);
      }
      onChange(selectedValues);
    } else {
      setSelectedValues([newValue]);
      onChange(selectedValues[0]);
    }
  };

  return (
    <div className="flex flex-col content-stretch gap-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={selectedValues}
        multiple={isMultiple}
        onChange={onValuesChange}
        disabled={isDisabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
      >
        {defaultValue && (
          <option defaultValue={defaultValue}>Sélectionner...</option>
        )}
        {values &&
          values.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>
    </div>
  );
};
