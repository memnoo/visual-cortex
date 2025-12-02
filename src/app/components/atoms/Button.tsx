import React from "react";
import { Icon, ICON_NAME } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "transparent";

type IconPosition = "left" | "right";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  iconName: ICON_NAME;
  iconPosition?: IconPosition;
}

export default function Button({
  variant = "primary",
  iconName,
  iconPosition = "left",
  className = "",
  children,
  ...props
}: Props) {
  const base = "btn";
  const variants: Record<Variant, string> = {
    primary:
      "bg-primary-500 text-white shadow-sm-primary hover:shadow-primary disabled:opacity-50",
    secondary:
      "bg-secondary-500 text-white hover:bg-secondary-600 disabled:opacity-50",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
    transparent:
      "bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-300",
    danger: "bg-danger-500 text-white hover:bg-danger-600",
  };

  if (iconPosition === "right") {
    className += "flex flex-row-reverse";
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {iconName && <Icon name={iconName} />}
      {children}
    </button>
  );
}
