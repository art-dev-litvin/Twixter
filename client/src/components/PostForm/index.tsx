import React from "react";
import { useFormik } from "formik";
import { fileToBase64 } from "../../utils/fileToBase64";
import { postFormSchema, PostFormFields } from "./schema";
import FormField from "../FormField";
import Button from "../Button";

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
      imageBase64: "",
    },
    validationSchema: postFormSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      await handleSubmit(values);

      if (operation === "create") {
        formik.resetForm();
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

    if (file) {
      const imageBase64 = await fileToBase64(file);

      formik.setFieldValue("imageBase64", imageBase64);
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
        {formik.touched.imageBase64 && formik.errors.imageBase64 && (
          <FormField.Error>{formik.errors.imageBase64}</FormField.Error>
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
