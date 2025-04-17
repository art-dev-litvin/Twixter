import * as Yup from "yup";

export type PostFormFields = Yup.InferType<typeof postFormSchema>;

export const postFormSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  imageBase64: Yup.string().optional(),
});
