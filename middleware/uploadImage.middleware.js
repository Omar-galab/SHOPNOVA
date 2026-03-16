import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/apiError.js";

console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  // don't log secret
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary with resize
export const handleUpload = async (file, folder, width, height) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    resource_type: "auto",
    folder: `ShopNova/${folder}`,
    transformation: [
      {
        width,
        height,
        crop: "fill",
        gravity: "auto",
      },
      {
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });

  return result.secure_url; //  return Cloudinary URL
};
// Create ONCE
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only image files are allowed", 400), false);
  }
};

// ONE instance
const upload = multer({ storage, fileFilter });

export const uploadSingleImage = (fieldName) => upload.single(fieldName);

export const uploadMixOFImages = (arrayOFFields) =>
  upload.fields(arrayOFFields);
