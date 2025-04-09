import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

type Variant = "green" | "gray" | "destructive" | "destructiveOutlined";

interface BaseButtonProps {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps =
  | ({
      to: string;
    } & BaseButtonProps &
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type">)
  | (BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>);

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "green",
  fullWidth,
  ...props
}) => {
  const classNamesCombined = classNames(
    "h-11 px-3 border rounded-md cursor-pointer transition-colors duration-200 inline-flex items-center justify-center ",
    {
      "bg-emerald-500 hover:[&:not(:disabled)]:bg-emerald-600 py-2 px-4 text-white font-medium":
        variant === "green",
      "bg-slate-500 text-white hover:[&:not(:disabled)]:bg-slate-600":
        variant === "gray",
      "bg-red-500 text-white hover:[&:not(:disabled)]:bg-red-600":
        variant === "destructive",
      "border-red-500 text-red-500 hover:[&:not(:disabled)]:bg-red-50":
        variant === "destructiveOutlined",
      "w-full": fullWidth,
      "bg-gray-400 !cursor-not-allowed": (props as any).disabled,
    },
    className
  );

  if ("to" in props) {
    const { to, ...rest } = props;
    return (
      <Link
        to={to}
        className={classNamesCombined}
        onClick={(e) => {
          if ((props as any).disabled) e.preventDefault();
        }}
        {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classNamesCombined}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

export default Button;
