
import { File } from 'multer';
import cloudinary from './cloudinary';

export const uploadToCloudinary = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'profile-pics' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    ).end(file.buffer);
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<any> => {
  return cloudinary.uploader.destroy(publicId);
};


export function extractPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const fileName = parts.pop();
  const folder = parts.slice(-1)[0];
  const publicId = `${folder}/${fileName?.split('.')[0]}`;
  return publicId;
}