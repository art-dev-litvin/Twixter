import React from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormField from "../FormField";
import Button from "../Button";
import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/auth/Auth.hook";
import { updateUser } from "../../services/api-requests/updateUser";
import { EditUserFieldsValues, EditUserSchema } from "./schema";

function EditUserForm() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const {
    setValues,
    isSubmitting,
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormik<EditUserFieldsValues>({
    initialValues: {
      username: user?.displayName || "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: EditUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = await updateUser({
        username: values.username,
        newPassword: values.newPassword,
      });

      setSubmitting(false);

      if ("error" in data) {
        toast.error(data.error);
      } else {
        toast.success(data.result);

        setUser({
          ...data.updatedUser,
        });
        navigate(routes.profile);
      }
    },
  });

  React.useEffect(() => {
    setValues({
      username: user?.displayName || "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [user, setValues]);

  if (!user) {
    return (
      <div>
        <h1>Error, you need to login first!</h1>
      </div>
    );
  }

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
        <FormField.Label htmlFor="password">New password</FormField.Label>
        <FormField.Input
          type="password"
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

      <FormField className="mt-4">
        <FormField.Label htmlFor="password">
          Confirm new password
        </FormField.Label>
        <FormField.Input
          type="password"
          value={values.confirmNewPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          id="confirmNewPassword"
          name="confirmNewPassword"
        />
        {touched.confirmNewPassword && errors.confirmNewPassword && (
          <FormField.Error>{errors.confirmNewPassword}</FormField.Error>
        )}
      </FormField>

      <Button className="mt-4" fullWidth type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </Button>
    </form>
  );
}

export default EditUserForm;
