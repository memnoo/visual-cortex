import { useTranslations } from "next-intl";
import { useState } from "react";

export type SelectProps = {
  label?: string;
  values: { label: string | number; value: string | number }[];
  onChange: (newValue: (string | number) | (string | number)[]) => void;
  isDisabled?: boolean;
  isMultiple?: boolean;
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
  const t = useTranslations();
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

  const onValuesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const newValues = selectedOptions.map((option) => {
      const originalValue = values.find(
        (v) => String(v.value) === option.value
      )?.value;
      return originalValue ?? option.value;
    });

    if (isMultiple) {
      setSelectedValues(newValues);
      onChange(newValues);
    } else {
      const newValue = newValues[0];
      setSelectedValues([newValue]);
      onChange(newValue);
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
        value={
          isMultiple
            ? selectedValues.map(String)
            : String(selectedValues[0] || "")
        }
        multiple={isMultiple}
        onChange={onValuesChange}
        disabled={isDisabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
      >
        {defaultValue && <option value="">{t("misc.select")}</option>}
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
