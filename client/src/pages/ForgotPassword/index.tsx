import Card from "../../components/Card";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Forgot password</h2>
      <ForgotPasswordForm />
    </Card>
  );
}

export default ForgotPassword;
