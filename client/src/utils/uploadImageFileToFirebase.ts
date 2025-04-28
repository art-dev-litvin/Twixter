import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestoreDB, storage } from "../services/firebase";
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
    const imageUrl = await getDownloadURL(storageRef);

    const imageDoc = await addDoc(collection(firestoreDB, "posts-images"), {
      url: imageUrl,
      storagePath: path,
      createdAt: serverTimestamp(),
      temporary: true,
    });

    return {
      imageUrl: imageUrl,
      imageId: imageDoc.id,
    };
  });
};
