import { PropsWithChildren } from "react";
import GoogleLogoImg from "../../assets/google-logo.webp";
import { signInWithGoogle } from "../../services/api-requests/auth/signInWithGoogle";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function SignUpWithGoogleButton({
  children,
  authMethod,
}: PropsWithChildren<{ authMethod: "signin" | "signup" }>) {
  const navigate = useNavigate();

  const onClick = async () => {
    const res = await signInWithGoogle();

    if (handleResultWithToast(res)) {
      const successText =
        authMethod === "signup"
          ? "Sign up with google successful!"
          : "Sign in with google successful!";

      toast.success(successText);
      navigate(routes.home);
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex gap-3 items-center justify-center border-2 h-16 px-5 rounded-2xl cursor-pointer">
      <img src={GoogleLogoImg} alt="google logo" className="size-8" />
      {children}
    </button>
  );
}

export default SignUpWithGoogleButton;
