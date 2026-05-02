import "server-only";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

/**
 * Cloudflare R2 (S3-compatible) helper. Used to host user-uploaded
 * cover images for videos. The public URL is served via the bucket's
 * R2.dev development subdomain (or a custom domain in the future).
 *
 * All covers are re-encoded to WebP server-side (sharp) before upload:
 *   - Horizontal: max 1600 px wide
 *   - Vertical:   max 1080 px wide
 *   - Quality 80, mozjpeg-style chroma subsampling on WebP
 * A user dropping a 4 MB raw photo ends up shipping ~80 KB of WebP.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID            f993b4d539f1c05590e8e38d1f5f908d
 *   R2_ACCESS_KEY_ID         (S3-compatible Access Key)
 *   R2_SECRET_ACCESS_KEY     (S3-compatible Secret)
 *   R2_BUCKET_NAME           cheap-actors
 *   R2_PUBLIC_URL            https://pub-XXXXX.r2.dev (no trailing slash)
 */

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "cheap-actors";
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(
  /\/$/,
  "",
);

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials missing — check R2_* env vars");
  }
  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}

export const ALLOWED_COVER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5 MB raw upload

export type CoverFormat = "horizontal" | "vertical";

export type UploadResult =
  | { ok: true; url: string; key: string }
  | { ok: false; error: string };

/**
 * Compress + re-encode the buffer to WebP at a sensible max width
 * for the target format. Always rotates per EXIF and strips metadata
 * (faster, no privacy leak).
 */
async function compressToWebp(
  input: Buffer,
  format: CoverFormat,
): Promise<Buffer> {
  const maxWidth = format === "horizontal" ? 1600 : 1080;
  return sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();
}

/**
 * Upload a video cover to R2 under covers/<userId>/<random>.webp
 * (always WebP after compression) and return its public URL.
 */
export async function uploadCover(
  userId: string,
  file: File,
  format: CoverFormat = "horizontal",
): Promise<UploadResult> {
  if (!ALLOWED_COVER_TYPES.includes(file.type as never)) {
    return { ok: false, error: "Format non supporté (JPG, PNG, WebP, AVIF)" };
  }
  if (file.size > MAX_COVER_SIZE) {
    return { ok: false, error: "Image trop lourde (5 Mo max)" };
  }
  if (!R2_PUBLIC_URL) {
    return { ok: false, error: "R2_PUBLIC_URL manquant côté serveur" };
  }

  try {
    const raw = Buffer.from(await file.arrayBuffer());
    const optimized = await compressToWebp(raw, format);

    const random = Math.random().toString(36).slice(2, 10);
    const key = `covers/${userId}/${Date.now()}-${random}.webp`;

    await getClient().send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: optimized,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { ok: true, url: `${R2_PUBLIC_URL}/${key}`, key };
  } catch (err) {
    console.error("[r2] upload failed:", err);
    return { ok: false, error: "Échec de l'upload sur R2" };
  }
}
