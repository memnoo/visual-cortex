import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
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
    danger: "bg-danger-500 text-white hover:bg-danger-600",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
