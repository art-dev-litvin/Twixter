import React from "react";

interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md border-t-2 border-slate-50 rounded-lg">
      {children}
    </div>
  );
}

export default Card;
