import React from "react";
import { useFormik } from "formik";
import { postFormSchema, PostFormFields } from "./schema";
import FormField from "../FormField";
import Button from "../Button";
import { handleUploadImagePost } from "../../utils/handleUploadImagePost";

interface PostFormProps {
  operation: "update" | "create";
  handleSubmit: (values: PostFormFields) => Promise<{} | void>;
  defaultFieldValues?: Partial<PostFormFields>;
}

function PostForm({
  handleSubmit,
  operation,
  defaultFieldValues,
}: PostFormProps) {
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoadingImage, setIsLoadingImage] = React.useState(false);

  const formik = useFormik<PostFormFields>({
    initialValues: {
      title: defaultFieldValues?.title || "",
      content: defaultFieldValues?.content || "",
      imageUrl: defaultFieldValues?.imageUrl,
      imageId: undefined,
    },
    validationSchema: postFormSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const res = await handleSubmit(values);

      formik.setSubmitting(false);

      if (res) {
        if (operation === "create") {
          formik.resetForm();
        }

        const imageFileInput = imageFileInputRef.current;
        if (imageFileInput) {
          imageFileInput.value = "";
        }
      }
    },
  });

  const onChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.currentTarget.files?.[0];
    const imagePath = `posts/images/${crypto.randomUUID()}`;

    setIsLoadingImage(true);

    if (imageFile) {
      const data = await handleUploadImagePost({
        imageFile,
        imagePath,
      });

      if (data) {
        formik.setFieldValue("imageUrl", data.imageUrl);
        formik.setFieldValue("imageId", data.imageId);
      }
    }

    setIsLoadingImage(false);
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
        <FormField.Input
          ref={imageFileInputRef}
          type="file"
          id="imageBase64"
          name="imageBase64"
          onChange={onChangeImage}
          accept="image/*"
        />
        {isLoadingImage && (
          <p className="mt-1 text-sm animate-pulse">Uploading image...</p>
        )}

        {formik.values.imageUrl && (
          <img
            className="mt-4 w-full h-52 object-cover rounded-md"
            src={formik.values.imageUrl}
            alt="image for new post"
          />
        )}
      </FormField>
      <div className="mt-4">
        <Button
          fullWidth
          type="submit"
          disabled={isLoadingImage && formik.isSubmitting}>
          {formik.isSubmitting ? "Creating..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
