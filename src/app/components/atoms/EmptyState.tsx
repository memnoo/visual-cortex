import { PropsWithChildren } from "react";
import { Icon, IconName } from "./Icon";

type EmptyStateProps = {
  label: string;
  icon?: IconName;
} & PropsWithChildren;

export const EmptyState = ({
  children,
  label,
  icon = undefined,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-2 text-center">
    {icon && <Icon name={icon} />}
    <p className="text-gray-500">{label}</p>
    {children && <div className="pt-4">{children}</div>}
  </div>
);
