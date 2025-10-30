import multer from 'multer'
import path from "path";

const storage1 = multer.diskStorage({
  destination: './uploads/user-post/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const storage2 = multer.diskStorage({
  destination: './uploads/profile/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const storage3 = multer.diskStorage({
  destination: './uploads/coverPhoto/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const storage4 = multer.diskStorage({
  destination: './uploads/message/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const storage5 = multer.diskStorage({
  destination: './uploads/resume/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const storage6 = multer.diskStorage({
  destination: './uploads/companyDocument/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const storage7 = multer.diskStorage({
  destination: './uploads/message/Voice/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


const upload = multer({ storage:storage1 });
const uploadProfile = multer({ storage:storage2});
const uploadCover = multer({ storage:storage3});
const uploadMessage = multer({ storage:storage4});
const resumeUpload = multer({ storage:storage5});
const companyDocumentUpload = multer({ storage:storage6});

const uploadVoice = multer({storage:storage7})

  export {upload, uploadProfile,uploadCover, uploadMessage,resumeUpload,companyDocumentUpload, uploadVoice}