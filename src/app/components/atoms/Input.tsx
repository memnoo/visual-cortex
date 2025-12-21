import React from "react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`block w-full rounded-button border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
      props.className ?? ""
    }`}
  />
);
