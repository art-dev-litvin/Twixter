import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase";
import { runSafeAsync } from "./runSafeAsync";

export const uploadImageFileToFirebase = async ({
  file,
  path,
}: {
  file: File;
  path: string;
}) => {
  return runSafeAsync(async () => {
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  });
};
