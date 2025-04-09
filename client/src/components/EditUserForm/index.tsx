import { useFormik } from "formik";
import { EditUserFieldsValues, EditUserSchema } from "./schema";
//import { toast } from "react-toastify";
//import { useNavigate } from "react-router-dom";
//import { routes } from "../../constants/routes";
import FormField from "../FormField";
import Button from "../Button";

function EditUserForm() {
  //const navigate = useNavigate();

  const {
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik<EditUserFieldsValues>({
    initialValues: {
      username: "",
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: EditUserSchema,
    onSubmit: async (/*values, { setSubmitting }*/) => {
      console.log("submitted");
      //setSubmitting(false);
      //if (error) {
      //  toast.error(error);
      //}
      //if (user) {
      //  toast.success("Sign up successful!");
      //  navigate(routes.emailVerification);
      //}
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
        <FormField.Label htmlFor="password">Old password</FormField.Label>
        <FormField.Input
          value={values.oldPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          id="oldPassword"
          name="oldPassword"
        />
        {touched.oldPassword && errors.oldPassword && (
          <FormField.Error>{errors.oldPassword}</FormField.Error>
        )}
      </FormField>

      <FormField className="mt-4">
        <FormField.Label htmlFor="password">New password</FormField.Label>
        <FormField.Input
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          id="newPassword"
          name="newPassword"
        />
        {touched.newPassword && errors.newPassword && (
          <FormField.Error>{errors.newPassword}</FormField.Error>
        )}
      </FormField>

      <Button className="mt-4" fullWidth type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </Button>
    </form>
  );
}

export default EditUserForm;
