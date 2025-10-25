import { PropsWithChildren } from "react";

export type CalloutProps = {
  type: "success" | "error" | "warning";
} & PropsWithChildren;

const CLASSES = {
  success: "bg-green-50 text-green-800 border border-green-200",
  error: "bg-red-50 text-red-800 border border-red-200",
  warning: "bg-orange-50 text-orange-800 border border-orange-200",
};

export const Callout = ({ type, children }: CalloutProps) => {
  return (
    <div className={`p-4 rounded-lg ${CLASSES[type]}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
};
