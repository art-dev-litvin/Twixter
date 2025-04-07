import { useFormik } from "formik";
import { SignupSchema } from "./schema";
import { SignupFormValues } from "./types";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { signUp } from "../../services/api-requests/signUp";

function SignUp() {
  const navigate = useNavigate();

  const {
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      username: "Username",
      email: "test@gmail.com",
      password: "helloworld123",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values: SignupFormValues, { setSubmitting }) => {
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
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <Input
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            id="username"
            name="username"
          />
          {touched.username && errors.username && (
            <div className="text-red-500 text-sm mt-1">{errors.username}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            id="email"
            type="email"
            name="email"
          />
          {touched.email && errors.email && (
            <div className="text-red-500 text-sm mt-1">{errors.email}</div>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            id="password"
            type="password"
            name="password"
          />
          {touched.password && errors.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-600"
                } transition-colors duration-200`}>
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </Card>
  );
}

export default SignUp;
