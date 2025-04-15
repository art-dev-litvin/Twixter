import * as admin from 'firebase-admin';

/**
 * Uploads a base64 image to Firebase Storage.
 * @param base64Data - The base64 string of the image.
 * @param path - The path where the file should be stored in Firebase Storage.
 * @param mimeType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns The public URL of the uploaded file.
 */
export async function uploadBase64ToFirebaseStorage(
  base64Data: string,
  path: string,
  mimeType: string,
): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(path);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    await fileUpload.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${path}`;
  } catch (error) {
    throw new Error(
      `Failed to upload file to Firebase Storage: ${error.message}`,
    );
  }
}
