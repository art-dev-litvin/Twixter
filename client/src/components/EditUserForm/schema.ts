import * as Yup from "yup";

export type EditUserFieldsValues = Yup.InferType<typeof EditUserSchema>;

export const EditUserSchema = Yup.object().shape(
  {
    username: Yup.string().required("Username is required"),
    newPassword: Yup.string()
      .min(8, "Password should be 8 or more characters")
      .when("confirmNewPassword", {
        is: (val: string | undefined) => !!val && val.length > 0,
        then: (schema) => schema.required("New password is required"),
      }),
    confirmNewPassword: Yup.string().when("newPassword", {
      is: (val: string | undefined) => !!val && val.length > 0,
      then: (schema) =>
        schema
          .required("Confirm new password is required")
          .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
  },
  [["newPassword", "confirmNewPassword"]]
);
