
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max per file
});

export const gameUploadMiddleware = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]);
console.log(gameUploadMiddleware)