import React from "react";
import { useFormik } from "formik";
import { postFormSchema, PostFormFields } from "./schema";
import FormField from "../FormField";
import Button from "../Button";
import { uploadImageFileToFirebase } from "../../utils/uploadImageFileToFirebase";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { removeImageFileFromFirebase } from "../../utils/removeImageFileFromFirebase";

interface PostFormProps {
  operation: "update" | "create";
  handleSubmit: (values: PostFormFields) => Promise<void>;
  defaultFieldValues?: {
    title: string;
    content: string;
    imageUrl: string | undefined;
  };
}

function PostForm({
  handleSubmit,
  operation,
  defaultFieldValues,
}: PostFormProps) {
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);

  const formik = useFormik<PostFormFields>({
    initialValues: {
      title: defaultFieldValues?.title || "",
      content: defaultFieldValues?.content || "",
      imageUrl: localStorage.getItem("newPostImageUrl") || undefined,
    },
    validationSchema: postFormSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      await handleSubmit(values);

      if (operation === "create") {
        formik.resetForm();
        localStorage.removeItem("newPostImageUrl");
        localStorage.removeItem("newPostImagePath");
      }

      const imageFileInput = imageFileInputRef.current;
      if (imageFileInput) {
        imageFileInput.value = "";
      }

      formik.setSubmitting(false);
    },
  });

  const onChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    const path = `posts/images/${crypto.randomUUID()}`;

    if (file) {
      const oldNewPostImagePath = localStorage.getItem("newPostImagePath");

      if (oldNewPostImagePath) {
        await removeImageFileFromFirebase(oldNewPostImagePath);
      }

      const result = await uploadImageFileToFirebase({ file, path });

      const uploadedImageUrl = handleResultWithToast(result);

      if (uploadedImageUrl) {
        localStorage.setItem("newPostImageUrl", uploadedImageUrl);
        localStorage.setItem("newPostImagePath", path);

        formik.setFieldValue("imageUrl", uploadedImageUrl);
      }
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-[500px] w-full flex flex-col gap-3">
      <FormField>
        <FormField.Label htmlFor="title">Title</FormField.Label>
        <FormField.Input
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <FormField.Error>{formik.errors.title}</FormField.Error>
        )}
      </FormField>

      <FormField>
        <FormField.Label htmlFor="content">Content</FormField.Label>
        <FormField.Textarea
          id="content"
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.content && formik.errors.content && (
          <FormField.Error>{formik.errors.content}</FormField.Error>
        )}
      </FormField>

      <FormField>
        <FormField.Label htmlFor="imageBase64">Image</FormField.Label>
        {operation === "update" && defaultFieldValues?.imageUrl && (
          <img
            className="h-40 w-full object-cover rounded-xl my-2 border-2 border-slate-500"
            src={defaultFieldValues?.imageUrl}
            alt={defaultFieldValues?.title}
          />
        )}
        <FormField.Input
          ref={imageFileInputRef}
          type="file"
          id="imageBase64"
          name="imageBase64"
          onChange={onChangeImage}
          accept="image/*"
        />
        {formik.values.imageUrl && (
          <img
            className="mt-4 w-full h-52 object-cover rounded-md"
            src={formik.values.imageUrl}
            alt="image for new post"
          />
        )}
      </FormField>
      <div className="mt-4">
        <Button fullWidth type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Creating..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
