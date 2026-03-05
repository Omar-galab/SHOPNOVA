import multer from "multer";
import ApiError from "../utils/apiError.js";

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
