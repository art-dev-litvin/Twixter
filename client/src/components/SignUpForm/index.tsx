import { useFormik } from "formik";
import { SignUpSchema } from "./schema";
import { SignUpFormValues } from "./types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { signUp } from "../../services/api-requests/signUp";
import FormField from "../FormField";
import Button from "../Button";

function SignUpForm() {
  const navigate = useNavigate();

  const {
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik<SignUpFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { user, error } = await signUp(
        values.username,
        values.email,
        values.password
      );

      setSubmitting(false);

      if (error) {
        toast.error(error);
      }

      if (user) {
        toast.success("Sign up successful!");
        navigate(routes.emailVerification);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <FormField.Label htmlFor="username">Username</FormField.Label>
        <FormField.Input
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          id="username"
          name="username"
        />
        {touched.username && errors.username && (
          <FormField.Error>{errors.username}</FormField.Error>
        )}
      </FormField>

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

      <Button className="mt-4" fullWidth type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </Button>
    </form>
  );
}

export default SignUpForm;
