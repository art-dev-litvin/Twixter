import NavLink from "../NavLink";
import { routes } from "../../constants/routes";

function ForgotPasswordLink() {
  return (
    <NavLink className="text-sm inline-block mt-2" to={routes.forgotPassword}>
      Forgot password?
    </NavLink>
  );
}

export default ForgotPasswordLink;
