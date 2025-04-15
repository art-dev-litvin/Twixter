/**
 * Parses a base64 image string and extracts the MIME type and base64 data.
 * @param base64String - The base64 string of the image.
 * @param uid - The user ID or identifier for generating the file path.
 * @returns An object containing the MIME type, base64 data, and generated file path.
 * @throws Error if the base64 string is invalid.
 */
export function parseBase64Image(base64String: string): {
  mimeType: string;
  base64Data: string;
} {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  return { mimeType, base64Data };
}
