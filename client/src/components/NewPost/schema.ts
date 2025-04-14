import * as Yup from "yup";

export type NewPostSchema = Yup.InferType<typeof newPostSchema>;

export const newPostSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
});
