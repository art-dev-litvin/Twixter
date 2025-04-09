import * as Yup from "yup";

export type EditUserFieldsValues = Yup.InferType<typeof EditUserSchema>;

export const EditUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  oldPassword: Yup.string().test(
    "require-new-password",
    "New password is required when old password is provided",
    function (value) {
      const { newPassword } = this.parent;

      // If oldPassword is provided but newPassword is empty, throw an error
      if (value && !newPassword) {
        return this.createError({
          path: "newPassword",
          message: "New password is required when old password is provided",
        });
      }

      return true;
    }
  ),
  newPassword: Yup.string()
    .test(
      "passwords-check",
      "Old password is required when setting a new password",
      function (value) {
        const { oldPassword } = this.parent;

        // Skip validation if both fields are empty
        if (!value && !oldPassword) {
          return true;
        }

        // Validate that oldPassword is provided if newPassword is set
        if (value && !oldPassword) {
          return this.createError({
            path: "oldPassword",
            message: "Old password is required when setting a new password",
          });
        }

        return true;
      }
    )
    .test(
      "min-length-check",
      "New password must be at least 8 characters",
      function (value) {
        // Skip validation if the field is empty
        if (!value) {
          return true;
        }

        // Apply the minimum length validation
        return value.length >= 8;
      }
    ),
});
