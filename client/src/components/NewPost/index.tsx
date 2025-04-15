import React from "react";
import Button from "../Button";
import Popup from "../Popup";
import { useFormik } from "formik";
import { newPostSchema } from "./schema";
import FormField from "../FormField";
import { fileToBase64 } from "../../utils/fileToBase64";
import { createPost } from "../../services/api-requests/createPost";
import { toast } from "react-toastify";
import { PostType } from "../../types/post";

interface NewPostProps {
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

function NewPost({ setPosts }: NewPostProps) {
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      imageBase64: "",
    },
    validationSchema: newPostSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      const data = await createPost(values);

      if ("error" in data) {
        toast.error(data.error);
      } else {
        setPosts((prev) => [...prev, data]);
        toast.success("Post created!");

        formik.resetForm();

        const imageFileInput = imageFileInputRef.current;
        if (imageFileInput) {
          imageFileInput.value = "";
        }

        setOpenPopup(false);
      }

      setIsLoading(false);
    },
  });

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const onChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file) {
      const imageBase64 = await fileToBase64(file);

      formik.setFieldValue("imageBase64", imageBase64);
    }
  };

  return (
    <>
      <Button onClick={handlePopup(true)}>New post</Button>

      <Popup open={openPopup} onClose={handlePopup(false)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Create new post
        </h3>
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
            {formik.touched.imageBase64 && formik.errors.imageBase64 && (
              <FormField.Error>{formik.errors.imageBase64}</FormField.Error>
            )}
          </FormField>
          <div className="mt-4">
            <Button fullWidth type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      </Popup>
    </>
  );
}

export default NewPost;
