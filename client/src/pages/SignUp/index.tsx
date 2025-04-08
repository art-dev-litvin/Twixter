import Card from "../../components/Card";
import SignUpForm from "../../components/SignUpForm";
import SignUpWithGoogleButton from "../../components/SignUpWithGoogleButton";

function SignUp() {
  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <SignUpForm />
      </Card>
      <Card className="flex justify-center">
        <SignUpWithGoogleButton authMethod="signup">
          Sign up with google
        </SignUpWithGoogleButton>
      </Card>
    </>
  );
}

export default SignUp;
