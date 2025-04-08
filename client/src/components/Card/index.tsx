import classNames from "classnames";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "max-w-md mx-auto mt-10 p-6 bg-white shadow-md border-t-2 border-slate-50 rounded-lg",
        className
      )}>
      {children}
    </div>
  );
}

export default Card;
