import { Request, Response } from "express";
import crypto from "crypto";
import http from "http";
import sharp from "sharp";
import { supabase } from "../../supabase";
 
const BUCKET_NAME = process.env.SUPABASE_BUCKET || "listing-photos";
const MAX_INPUT_PIXELS = 40_000_000; // decompression bomb
 
export const uploadPhotos = async (req: Request, res: Response) => {
  const uploadedPaths: string[] = [];
  
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
 
    const results = await Promise.allSettled(
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
        
        uploadedPaths.push(filePath);
 
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        return data.publicUrl;
      })
    );
 
    const rejected = results.find(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );
    if (rejected) {
      throw rejected.reason;
    }
 
    const urls = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
 
    return res.status(201).json({ urls });
  } catch (error) {
    if(uploadedPaths.length > 0){
      try{
        await supabase.storage.from(BUCKET_NAME).remove(uploadedPaths);
        console.log("Rollback orphaned files");
      }catch(cleanupError){
        console.error("Failed to cleanup orphaned files:", cleanupError);
      }
    }
    console.error("Supabase upload error:", error);
    return res.status(500).json({ error: http.STATUS_CODES[500] });
  }
};