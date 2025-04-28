import React from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormField from "../FormField";
import Button from "../Button";
import { routes } from "../../constants/routes";
import { useAuth } from "../../contexts/auth/Auth.hook";
import { updateUser } from "../../services/api-requests/auth/updateUser";
import { EditUserFieldsValues, EditUserSchema } from "./schema";
import Avatar from "../Avatar";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { uploadImageFileToFirebase } from "../../utils/uploadImageFileToFirebase";

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
      const result = await updateUser({
        username: values.username,
        newPassword: values.newPassword || undefined,
        userId: user!.uid,
      });

      setSubmitting(false);

      const updatedUser = handleResultWithToast(result);

      if (updatedUser) {
        toast.success("User has been updated!");

        setUser({
          ...updatedUser,
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

  const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && user) {
      const imageFile = files[0];
      const imagePath = `users/${user.uid}/avatars/${crypto.randomUUID()}`;

      setSubmitting(true);

      const updatedUserImageData = await uploadImageFileToFirebase({
        file: imageFile,
        path: imagePath,
      });

      if (updatedUserImageData) {
        const result = await updateUser({
          updatedImageUrl: updatedUserImageData.imageUrl,
          userId: user.uid,
        });

        const updatedUser = handleResultWithToast(result);

        if (updatedUser) {
          toast.success("Avatar has been changed!");

          setUser({
            ...updatedUser,
          });
        }
      }

      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Error, you need to login first!</h1>
      </div>
    );
  }

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
