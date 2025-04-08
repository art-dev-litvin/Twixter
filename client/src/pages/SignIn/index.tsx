import Card from "../../components/Card";
import SignInForm from "../../components/SignInForm";
import SignUpWithGoogleButton from "../../components/SignUpWithGoogleButton";

function SignIn() {
  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <SignInForm />
      </Card>
      <Card className="flex justify-center">
        <SignUpWithGoogleButton authMethod="signin">
          Sign in with google
        </SignUpWithGoogleButton>
      </Card>
    </>
  );
}

export default SignIn;
