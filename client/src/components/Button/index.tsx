import classNames from "classnames";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "gray" | "destructive" | "destructiveOutlined";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "green",
  fullWidth,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "h-11 px-3 border rounded-md cursor-pointer transition-colors duration-200",
        {
          "bg-emerald-500 hover:bg-emerald-600 py-2 px-4 rounded-md text-white font-medium":
            variant === "green",
          "bg-slate-500 text-white hover:bg-slate-600": variant === "gray",
          "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
          "border-red-500 text-red-500 hover:bg-red-50":
            variant === "destructiveOutlined",
          "w-full": fullWidth,
          "bg-gray-400 cursor-not-allowed": props.disabled,
        },
        className
      )}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
