import uploadImage from "@/lib/cloudinary/upload-image";
import deleteImage, { extractPublicId } from "@/lib/cloudinary/delete-image";

export async function processImageUpload(
  image: File | null | undefined,
  folder: string,
  oldImageUrl?: string
): Promise<string | undefined> {
  if (!image || !(image instanceof File) || image.size === 0) {
    return undefined;
  }

  try {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadImage(buffer, folder);

    if (uploadResult?.secure_url) {
      if (oldImageUrl) {
        const publicId = extractPublicId(oldImageUrl);
        if (publicId)
          await deleteImage(publicId).catch((err) =>
            console.error("Failed to delete old image:", err)
          );
      }
      return uploadResult.secure_url;
    }
  } catch (error) {
    console.error(`Failed to upload image to ${folder}:`, error);
  }

  return undefined;
}
