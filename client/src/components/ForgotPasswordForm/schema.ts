import * as Yup from "yup";

export type ForgotPasswordFields = Yup.InferType<typeof ForgotPasswordSchema>;

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
