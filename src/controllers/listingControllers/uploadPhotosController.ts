import { Request, Response } from "express";
import crypto from "crypto";
import http from "http";
import sharp from "sharp";
import { supabase } from "../../supabase";

const BUCKET_NAME = process.env.SUPABASE_BUCKET || "listing-photos";
const MAX_INPUT_PIXELS = 40_000_000; // decompression bomb

export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const files = req.files as Express.Multer.File[];
    const webpBuffers: Buffer[] = [];

    for (const file of files) {
      try {
        const buffer = await sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS })
          .rotate()
          .resize(1600, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        webpBuffers.push(buffer);
      } catch {
        return res.status(400).json({ error: "Corrupted image or resolution exceeds limit" });
      }
    }

    const urls = await Promise.all(
      webpBuffers.map(async (buffer) => {
        const filePath = `listings/user_${userId}/${crypto.randomUUID()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, buffer, {
            contentType: "image/webp",
            upsert: false,
          });

        if(uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        return data.publicUrl;
      })
    );

    return res.status(201).json({ urls });
  } catch (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).json({ error: http.STATUS_CODES[500] });
  }
};