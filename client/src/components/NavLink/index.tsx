import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  disableHoverUnderline?: boolean;
}

function NavLink({ children, to, disableHoverUnderline }: NavLinkProps) {
  return (
    <Link
      className={classNames({ "hover:underline": !disableHoverUnderline })}
      to={to}>
      {children}
    </Link>
  );
}

export default NavLink;
