import React from "react";
import Card from "../../components/Card";
import { useAuth } from "../../contexts/auth/Auth.hook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

function EmailVerification() {
  const { user } = useAuth();
  const [waitingForVerification, setWaitingForVerification] =
    React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && !user.emailVerified) {
      setWaitingForVerification(true);

      const interval = setInterval(async () => {
        await user.reload();

        if (user.emailVerified) {
          clearInterval(interval);

          navigate(routes.home);
          toast.success("Email verified successfuly!");
        }
      }, 2000);
    }
  }, [user, navigate]);

  if (waitingForVerification) {
    return (
      <Card>
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">
            📩 Verification Link Sent!
          </h2>
          <p className="text-center">
            We've sent a verification link to your email. 📧 Please check your
            inbox (and spam folder, just in case). Click the link to verify your
            account.
          </p>
        </div>
      </Card>
    );
  }
}

export default EmailVerification;
