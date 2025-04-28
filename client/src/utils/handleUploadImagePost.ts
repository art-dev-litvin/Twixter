import { uploadImageFileToFirebase } from "./uploadImageFileToFirebase";
import { uploadTemporaryImagePost } from "./uploadTemporaryImagePost";

export const handleUploadImagePost = async ({
  imageFile,
  imagePath,
}: {
  imageFile: File;
  imagePath: string;
}) => {
  const uploadedImage = await uploadImageFileToFirebase({
    file: imageFile,
    path: imagePath,
  });

  if (uploadedImage) {
    return uploadTemporaryImagePost({
      imagePostPath: uploadedImage.path,
      imagePostUrl: uploadedImage.imageUrl,
    });
  }
};
