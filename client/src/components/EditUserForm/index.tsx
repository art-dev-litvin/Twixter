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
import Avatar from "../Avatar";

function EditUserForm() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const {
    setValues,
    isSubmitting,
    setSubmitting,
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
        newPassword: values.newPassword?.trim() || undefined,
        uid: user!.uid,
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

  const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const newAvatar = files[0];

      setSubmitting(true);

      const data = await updateUser({
        profileImage: newAvatar,
        uid: user!.uid,
      });

      setSubmitting(false);

      if ("error" in data) {
        toast.error(data.error);
      } else {
        toast.success(data.result);

        setUser({
          ...data.updatedUser,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <label className="group relative cursor-pointer flex flex-col items-center gap-2 mb-4">
          <Avatar src={user.photoURL || undefined} size={100} />
          <span className="group-hover:underline">Choose new avatar</span>
          <input
            onChange={onChangeAvatar}
            className="hidden"
            type="file"
            accept="image/*"
          />
        </label>
      </div>
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
