import { LogOutIcon } from "lucide-react";
import classNames from "classnames";
import { signout } from "../../services/api-requests/auth/signout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

interface SignOutButtonProps {
  className?: string;
}

function SignOutButton({ className }: SignOutButtonProps) {
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await signout();

    if (handleResultWithToast(res)) {
      navigate(routes.home);
      toast.success("You're signed out");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={classNames(
        "cursor-pointer size-10 flex justify-center items-center",
        className
      )}>
      <LogOutIcon />
    </button>
  );
}

export default SignOutButton;
