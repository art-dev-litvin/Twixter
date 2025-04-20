import FormField from "../FormField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignInFormValues } from "./types";
import { SignInSchema } from "./schema";
import { signIn } from "../../services/api-requests/auth/signIn";
import { toast } from "react-toastify";
import { routes } from "../../constants/routes";
import Button from "../Button";
import ForgotPasswordLink from "../ForgotPasswordLink";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function SignInForm() {
  const navigate = useNavigate();

  const {
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SignInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await signIn(values.email, values.password);

      setSubmitting(false);

      if (handleResultWithToast(res)) {
        toast.success("Sign in successful!");
        navigate(routes.home);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormField className="mt-4">
        <FormField.Label htmlFor="email">Email</FormField.Label>
        <FormField.Input
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          id="email"
          name="email"
        />
        {touched.email && errors.email && (
          <FormField.Error>{errors.email}</FormField.Error>
        )}
      </FormField>

      <FormField className="mt-4">
        <FormField.Label htmlFor="password">Password</FormField.Label>
        <FormField.Input
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          id="password"
          name="password"
        />
        {touched.password && errors.password && (
          <FormField.Error>{errors.password}</FormField.Error>
        )}
      </FormField>

      <ForgotPasswordLink />

      <Button className="mt-4" type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign In"}
      </Button>
    </form>
  );
}

export default SignInForm;
