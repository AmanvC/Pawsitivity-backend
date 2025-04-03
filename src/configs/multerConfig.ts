import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "dog_images",
    format: file.mimetype.split("/")[1],
    public_id: file.originalname,
  }),
});

const upload = multer({ storage });

export default upload;
