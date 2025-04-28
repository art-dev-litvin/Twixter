import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestoreDB } from "../services/firebase";
import { runSafeAsync } from "./runSafeAsync";
import { handleResultWithToast } from "./handleResultWithToast";

export const uploadTemporaryImagePost = async ({
  imagePostUrl,
  imagePostPath,
}: {
  imagePostUrl: string;
  imagePostPath: string;
}) => {
  const result = await runSafeAsync(async () => {
    const imageDoc = await addDoc(collection(firestoreDB, "posts-images"), {
      url: imagePostUrl,
      storagePath: imagePostPath,
      createdAt: serverTimestamp(),
      temporary: true,
    });

    return {
      imageUrl: imagePostUrl,
      imageId: imageDoc.id,
    };
  });

  return handleResultWithToast(result);
};
