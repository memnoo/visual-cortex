import React from "react";
import Link from "next/link";
import classNames from "classnames";

import { Icon, type IconName } from "./Icon";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "transparent"
  | "link";

type IconPosition = "left" | "right";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconName?: IconName;
  iconPosition?: IconPosition;
  href?: string;
}

export const Button = ({
  variant = "primary",
  iconName,
  iconPosition = "left",
  className = "",
  href,
  children,
  ...props
}: ButtonProps) => {
  const base = "btn";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-500 text-white shadow-sm-primary hover:shadow-primary disabled:opacity-50",
    secondary:
      "bg-secondary-500 text-white hover:bg-secondary-600 disabled:opacity-50",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
    transparent:
      "bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-300",
    danger: "bg-danger-500 text-white hover:bg-danger-600",
    link: "bg-white text-indigo-600 hover:bg-gray-50 border border-indigo-200",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={classNames(
          "px-8 py-3 font-semibold rounded-lg transition-colors shadow-lg",
          variants[variant]
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classNames(
        base,
        variants[variant],
        className,
        iconPosition === "right" && "flex flex-row-reverse"
      )}
      {...props}
    >
      {iconName && (
        <span className="ml-auto">
          <Icon name={iconName} />
        </span>
      )}
      {children}
    </button>
  );
};
