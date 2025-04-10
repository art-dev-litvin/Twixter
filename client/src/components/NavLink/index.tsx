import classNames from "classnames";
import { Link, LinkProps } from "react-router-dom";

interface NavLinkProps extends LinkProps {
  disableHoverUnderline?: boolean;
}

function NavLink({ className, disableHoverUnderline, ...props }: NavLinkProps) {
  return (
    <Link
      className={classNames(
        { "hover:underline": !disableHoverUnderline },
        className
      )}
      {...props}
    />
  );
}

export default NavLink;
