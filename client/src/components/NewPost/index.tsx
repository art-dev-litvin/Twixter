import React from "react";
import Button from "../Button";
import Popup from "../Popup";
import { useFormik } from "formik";
import { newPostSchema } from "./schema";
import FormField from "../FormField";
import axios from "axios";
import { apiPaths } from "../../constants/api-paths";

function NewPost() {
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      imageURL: "",
    },
    validationSchema: newPostSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await axios.post(apiPaths.posts.new, values);
        console.log("Post created successfully");
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setIsLoading(false);
      }
      console.log("Form Submitted:", values);
      setOpenPopup(false); // Close the popup after submission
    },
  });

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
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
            <FormField.Label htmlFor="imageURL">Image</FormField.Label>
            <FormField.Input
              type="file"
              id="imageURL"
              name="imageURL"
              value={formik.values.imageURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              accept="image/*"
            />
            {/* {formik.touched.imageURL && formik.errors.imageURL && (
              <FormField.Error>{formik.errors.imageURL}</FormField.Error>
            )} */}
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
