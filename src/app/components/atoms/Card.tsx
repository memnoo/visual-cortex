import React from "react";
import classNames from "classnames";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={classNames("bg-white p-6 rounded-lg shadow-md", className)}>
    {children}
  </div>
);
