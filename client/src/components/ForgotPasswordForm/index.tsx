import FormField from "../FormField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ForgotPasswordSchema, ForgotPasswordFields } from "./schema";
import { toast } from "react-toastify";
import { routes } from "../../constants/routes";
import Button from "../Button";
import { handleForgotPassword } from "../../services/api-requests/handleForgotPassword";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const {
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik<ForgotPasswordFields>({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await handleForgotPassword(values.email);

      setSubmitting(false);

      if ("error" in res) {
        toast.error(res.error);
      } else {
        toast.success(res.result);
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

      <Button className="mt-4" type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Send reset password email"}
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
