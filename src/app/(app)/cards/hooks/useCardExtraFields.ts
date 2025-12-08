import { Card } from "../../types/types";

export const EXCEPTION_PROPERTIES: ReadonlyArray<string> = ["kind"];

export const useCardExtraFields = (card: Card) => {
  const extraFields = card.extraFields ?? {};

  const exceptionValueFields = Object.entries(extraFields)
    .filter(([key, _]) => EXCEPTION_PROPERTIES.includes(key))
    .map(([_, value]) => value);

  const visibleFields = Object.entries(extraFields).filter(
    ([key, _]) => !EXCEPTION_PROPERTIES.includes(key)
  );

  const hasOnlyExceptionProperties = Object.keys(extraFields).every((p) =>
    EXCEPTION_PROPERTIES.includes(p.toLowerCase())
  );

  return {
    extraFields,
    exceptionValueFields,
    visibleFields,
    hasOnlyExceptionProperties,
  };
};
