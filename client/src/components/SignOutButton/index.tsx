import { LogOutIcon } from "lucide-react";
import classNames from "classnames";
import { signout } from "../../services/api-requests/signout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

interface SignOutButtonProps {
  className?: string;
}

function SignOutButton({ className }: SignOutButtonProps) {
  const navigate = useNavigate();

  const handleClick = async () => {
    const { error, result } = await signout();

    if (error) {
      toast.error(error);
    }

    if (result) {
      navigate(routes.home);
      toast.success(result);
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
