import { LogOutIcon } from "lucide-react";
import classNames from "classnames";
import { signout } from "../../services/api-requests/signout";
import { toast } from "react-toastify";

interface SignOutButtonProps {
  className?: string;
}

function SignOutButton({ className }: SignOutButtonProps) {
  const handleClick = async () => {
    const { error, result } = await signout();

    if (error) {
      toast.error(error);
    }

    if (result) {
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
