import multer from "multer";
import ApiError from "../utils/apiError.js";

// eslint-disable-next-line import/prefer-default-export
export const uploadSingleImage = (fieldName) => {
  const storage = multer.memoryStorage();

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image files are allowed", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.single(fieldName);
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${extension}`;
//     cb(null, fileName);
//   },
// });
