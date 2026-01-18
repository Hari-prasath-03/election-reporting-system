import cloudinary from "./index";

export const extractPublicId = (url: string) => {
  if (!url.includes("cloudinary.com")) return null;

  const parts = url.split("/");
  const filenameWithExtension = parts.pop();
  const folderPath = parts
    .slice(parts.indexOf("vote-count-share-app"))
    .join("/");

  if (!filenameWithExtension) return null;

  const filename = filenameWithExtension.split(".")[0];
  return `${folderPath}/${filename}`;
};

const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export default deleteImage;
