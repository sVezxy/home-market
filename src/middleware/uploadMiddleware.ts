import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES_COUNT = 10;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

class UnsupportedFileTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedFileTypeError";
  }
}

const hasImageSignature = (buf: Buffer): boolean => {
  if (buf.length < 12) return false;

  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isWebp =
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP";

  return isJpeg || isPng || isWebp;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_COUNT,
    fields: 0,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(
        new UnsupportedFileTypeError("Only JPEG, PNG, and WebP images are allowed")
      );
    }
    cb(null, true);
  },
}).array("photos", MAX_FILES_COUNT);

export const uploadPhotosMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err: unknown) => {
    if (err instanceof MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return res.status(400).json({ error: "File is too large (max 5 MB)" });
        case "LIMIT_FILE_COUNT":
          return res.status(400).json({ error: "Too many files (max 10 photos)" });
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).json({ error: "Use field name 'photos' for upload" });
        case "LIMIT_FIELD_COUNT":
          return res.status(400).json({ error: "Text fields are not allowed" });
        default:
          return res.status(400).json({ error: "Invalid upload payload" });
      }
    }

    if (err instanceof UnsupportedFileTypeError) {
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      console.error("Multipart parse error:", err);
      return res.status(400).json({ error: "Bad upload request" });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No photos provided" });
    }

    if (files.some((file) => !hasImageSignature(file.buffer))) {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    next();
  });
};