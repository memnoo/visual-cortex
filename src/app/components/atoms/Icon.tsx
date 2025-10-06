import React, { JSX } from "react";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  // small inline icon map — swap for lucide/react or heroicons in real project
  const map: Record<string, JSX.Element> = {
    sun: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M6.05 7.05L4.636 5.636"
        />
      </svg>
    ),
    moon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
      </svg>
    ),
  };
  return (
    <span className={`inline-flex ${className}`} aria-hidden>
      {map[name] ?? null}
    </span>
  );
}
