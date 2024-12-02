import multer from "multer";

const uploadMiddleware = multer({
  dest: "uploads/",
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype !== "application/json") {
      return cb(new Error("Only .json files are allowed"), false);
    }
    cb(null, true);
  },
  //limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadMiddleware;