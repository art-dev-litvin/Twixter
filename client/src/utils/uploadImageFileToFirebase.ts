import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase";
import { runSafeAsync } from "./runSafeAsync";
import { handleResultWithToast } from "./handleResultWithToast";

export const uploadImageFileToFirebase = async ({
  file,
  path,
}: {
  file: File;
  path: string;
}) => {
  const result = await runSafeAsync(async () => {
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    return {
      imageUrl: imageUrl,
      path,
    };
  });

  return handleResultWithToast(result);
};
