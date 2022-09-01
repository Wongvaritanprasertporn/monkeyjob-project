const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/storage/resume/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let ProfileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/storage/profile_img/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: resumeStorage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;