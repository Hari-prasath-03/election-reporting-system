import cloudinary from ".";
import { UploadApiResponse } from "cloudinary";

const uploadImage = async (file: Buffer, folder: string = "root") => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `vote-count-share-app/${folder}` },
      (error, result) => {
        if (error) reject(error.message);
        if (!result) return reject("No result from Cloudinary");
        resolve(result);
      }
    );
    stream.end(file);
  });
};

export default uploadImage;
