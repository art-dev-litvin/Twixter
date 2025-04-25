import { ref, deleteObject } from "firebase/storage";
import { runSafeAsync } from "./runSafeAsync";
import { storage } from "../services/firebase";

export async function removeImageFileFromFirebase(
  filePath: string
): Promise<{}> {
  return runSafeAsync(async () => {
    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
    return {};
  });
}
