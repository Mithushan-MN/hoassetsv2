// middlewares/upload.js
//
// Supports two storage strategies:
//   STORAGE=cloudinary  → uploads to Cloudinary (recommended for prod)
//   STORAGE=local       → saves to /uploads folder (default / dev)
//
// Required env vars (Cloudinary):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
//
// Install:
//   npm install multer multer-storage-cloudinary cloudinary




// const multer = require('multer');
// const path   = require('path');
// const fs     = require('fs');

// const STRATEGY = process.env.STORAGE || 'local';

// let storage;

// if (STRATEGY === 'cloudinary') {
//   const cloudinary               = require('cloudinary').v2;
//   const { CloudinaryStorage }    = require('multer-storage-cloudinary');

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:    process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => ({
//       folder:         'b2b-portal',
//       allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
//       transformation: [{ width: 1200, crop: 'limit' }],
//       public_id:      `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
//     }),
//   });

//   module.exports.deleteFile = async (publicId) => {
//     if (!publicId) return;
//     await cloudinary.uploader.destroy(publicId);
//   };

// } else {
//   // ── Local disk storage ──
//   const uploadDir = path.join(__dirname, '..', 'uploads');
//   if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//   storage = multer.diskStorage({
//     destination: (_req, _file, cb) => cb(null, uploadDir),
//     filename:    (_req, file, cb) => {
//       const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       cb(null, `${unique}${path.extname(file.originalname)}`);
//     },
//   });

//   module.exports.deleteFile = async (filePath) => {
//     if (!filePath) return;
//     const fullPath = path.join(__dirname, '..', 'uploads', path.basename(filePath));
//     if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//   };
// }

// const fileFilter = (_req, file, cb) => {
//   const allowed = /jpeg|jpg|png|webp|gif|svg/;
//   if (allowed.test(path.extname(file.originalname).toLowerCase()) &&
//       allowed.test(file.mimetype.replace('image/', ''))) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
// });

// module.exports.upload = upload;


const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ho-assets",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const deleteFile = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

module.exports = {
  upload,
  deleteFile,
};