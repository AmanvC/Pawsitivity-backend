import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("🔥 File received in multer-storage-cloudinary:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
    });

    // Optional: log something from req.body (only works if body-parser ran before)
    // console.log("Req body (if accessible here):", req.body);

    return {
      folder: "dog_images",
      public_id: `${Date.now()}-${file.originalname}`, // unique ID
      // format: file.mimetype.split("/")[1], // optional
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
