import "server-only";

import { ObjectId, type Collection } from "mongodb";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import {
  ROLES,
  TAGS,
  MAX_VIDEOS_PER_FORMAT,
  MAX_ROLES,
  MAX_TAGS_PER_VIDEO,
  type Role,
  type Tag,
  type VideoFormat,
  type ModerationStatus,
  type Video,
  type PublicUser,
  type AdminUser,
} from "./user-types";

export type {
  Role,
  Tag,
  VideoFormat,
  ModerationStatus,
  Video,
  PublicUser,
  AdminUser,
};
export { ROLES, TAGS, MAX_VIDEOS_PER_FORMAT, MAX_ROLES, MAX_TAGS_PER_VIDEO };

export type UserDoc = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  slug: string;
  displayName: string;
  /** 1 to 2 roles, e.g. ["acteur", "réalisateur"] */
  roles: Role[];
  tagline: string;
  bio: string;
  photoUrl?: string;
  basedIn?: string;
  born?: number;
  funFact?: string;
  videos: Video[];
  status: ModerationStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
};

/* =========================================================
 * Schemas
 * =========================================================
 */

const rolesField = z
  .array(z.enum(ROLES as [Role, ...Role[]]))
  .min(1, "Choisissez au moins un rôle")
  .max(MAX_ROLES, `Maximum ${MAX_ROLES} rôles`)
  .refine((arr) => new Set(arr).size === arr.length, "Pas de doublons");

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Au moins 8 caractères")
    .max(128, "Trop long"),
  displayName: z
    .string()
    .min(2, "Au moins 2 caractères")
    .max(60, "Trop long"),
  roles: rolesField,
});

export const profileSchema = z.object({
  displayName: z.string().min(2).max(60),
  roles: rolesField,
  tagline: z.string().max(120).optional().default(""),
  bio: z.string().max(800).optional().default(""),
  photoUrl: z
    .string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
  basedIn: z.string().max(60).optional().or(z.literal("")),
  born: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  funFact: z.string().max(160).optional().or(z.literal("")),
});

export const videoSchema = z.object({
  format: z.enum(["horizontal", "vertical"]),
  title: z.string().min(1, "Titre requis").max(80, "Trop long"),
  youtubeId: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{11}$/, "ID YouTube invalide"),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  description: z.string().max(280).optional().or(z.literal("")),
  tags: z
    .array(z.enum(TAGS as unknown as [Tag, ...Tag[]]))
    .max(MAX_TAGS_PER_VIDEO, `Maximum ${MAX_TAGS_PER_VIDEO} tags`)
    .optional(),
});

/* =========================================================
 * Helpers
 * =========================================================
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function newVideoId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function toPublicUser(u: UserDoc): PublicUser {
  return {
    id: u._id.toString(),
    slug: u.slug,
    displayName: u.displayName,
    roles: u.roles ?? [],
    tagline: u.tagline,
    bio: u.bio,
    photoUrl: u.photoUrl,
    basedIn: u.basedIn,
    born: u.born,
    funFact: u.funFact,
    videos: u.videos,
    status: u.status,
    rejectionReason: u.rejectionReason,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    reviewedAt: u.reviewedAt,
  };
}

export function toAdminUser(u: UserDoc): AdminUser {
  return { ...toPublicUser(u), email: u.email };
}

async function usersCollection(): Promise<Collection<UserDoc>> {
  const db = await getDb();
  const col = db.collection<UserDoc>("users");
  // Indexes are idempotent — safe to call repeatedly.
  await col.createIndex({ email: 1 }, { unique: true });
  await col.createIndex({ slug: 1 }, { unique: true });
  return col;
}

/* =========================================================
 * CRUD
 * =========================================================
 */

export async function getUserByEmail(email: string): Promise<UserDoc | null> {
  const col = await usersCollection();
  return col.findOne({ email: email.toLowerCase() });
}

export async function getUserBySlug(slug: string): Promise<UserDoc | null> {
  const col = await usersCollection();
  return col.findOne({ slug });
}

export async function getUserById(id: string): Promise<UserDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await usersCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

/** Public listings: only approved users, with only approved videos visible. */
export async function getAllPublicUsers(): Promise<PublicUser[]> {
  const col = await usersCollection();
  const docs = await col
    .find({ status: "approved" }, { sort: { createdAt: -1 } })
    .toArray();
  return docs.map((u) => {
    const pub = toPublicUser(u);
    pub.videos = pub.videos.filter((v) => v.status === "approved");
    return pub;
  });
}

/** Public detail: returns approved user with only approved videos. */
export async function getPublicUserBySlug(slug: string): Promise<PublicUser | null> {
  const u = await getUserBySlug(slug);
  if (!u || u.status !== "approved") return null;
  const pub = toPublicUser(u);
  pub.videos = pub.videos.filter((v) => v.status === "approved");
  return pub;
}

/** Pick a unique slug, appending a counter if needed. */
async function pickUniqueSlug(base: string): Promise<string> {
  const col = await usersCollection();
  let candidate = base || "anonyme";
  let counter = 2;
  // 50 attempts max — vanishingly unlikely to collide further.
  for (let i = 0; i < 50; i++) {
    const exists = await col.findOne({ slug: candidate }, { projection: { _id: 1 } });
    if (!exists) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  // Fallback to a random suffix.
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export type RegisterInput = z.infer<typeof registerSchema>;

export async function createUser(
  input: RegisterInput,
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();
  const existing = await getUserByEmail(email);
  if (existing) return { ok: false, error: "Cet email est déjà utilisé" };

  const slugBase = slugify(data.displayName);
  const slug = await pickUniqueSlug(slugBase);
  const passwordHash = await bcrypt.hash(data.password, 10);
  const now = new Date();

  const doc: Omit<UserDoc, "_id"> = {
    email,
    passwordHash,
    slug,
    displayName: data.displayName,
    roles: data.roles,
    tagline: "",
    bio: "",
    videos: [],
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const col = await usersCollection();
  const result = await col.insertOne(doc as UserDoc);
  return { ok: true, userId: result.insertedId.toString() };
}

export async function verifyPassword(
  email: string,
  password: string,
): Promise<UserDoc | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  return match ? user : null;
}

export type ProfileInput = z.infer<typeof profileSchema>;

export async function updateProfile(
  userId: string,
  input: ProfileInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  const d = parsed.data;
  const col = await usersCollection();

  // Re-slug if displayName changed (and ensure unique).
  const existing = await col.findOne({ _id: new ObjectId(userId) });
  if (!existing) return { ok: false, error: "Utilisateur introuvable" };

  let slug = existing.slug;
  if (d.displayName !== existing.displayName) {
    slug = await pickUniqueSlug(slugify(d.displayName));
  }

  const update: Partial<UserDoc> = {
    displayName: d.displayName,
    roles: d.roles,
    tagline: d.tagline ?? "",
    bio: d.bio ?? "",
    photoUrl: d.photoUrl || undefined,
    basedIn: d.basedIn || undefined,
    born: typeof d.born === "number" ? d.born : undefined,
    funFact: d.funFact || undefined,
    slug,
    updatedAt: new Date(),
  };

  await col.updateOne({ _id: new ObjectId(userId) }, { $set: update });
  return { ok: true };
}

export type VideoInput = z.infer<typeof videoSchema>;

export async function addVideo(
  userId: string,
  input: VideoInput,
): Promise<{ ok: true; video: Video } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const parsed = videoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }
  const d = parsed.data;
  const col = await usersCollection();
  const user = await col.findOne({ _id: new ObjectId(userId) });
  if (!user) return { ok: false, error: "Utilisateur introuvable" };

  const sameFormat = user.videos.filter((v) => v.format === d.format);
  if (sameFormat.length >= MAX_VIDEOS_PER_FORMAT) {
    return {
      ok: false,
      error: `Limite atteinte : ${MAX_VIDEOS_PER_FORMAT} vidéos ${d.format} maximum`,
    };
  }
  if (user.videos.some((v) => v.youtubeId === d.youtubeId)) {
    return { ok: false, error: "Cette vidéo est déjà dans votre profil" };
  }

  const video: Video = {
    id: newVideoId(),
    format: d.format,
    title: d.title,
    youtubeId: d.youtubeId,
    year: d.year,
    description: d.description || undefined,
    tags: d.tags && d.tags.length > 0 ? d.tags : undefined,
    status: "pending",
    submittedAt: new Date(),
  };

  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { videos: video }, $set: { updatedAt: new Date() } },
  );
  return { ok: true, video };
}

/* =========================================================
 * Admin / moderation helpers
 * =========================================================
 */

/** Whether the given email is the super-admin (env var SUPER_ADMIN_EMAILS, comma-separated). */
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.SUPER_ADMIN_EMAILS ?? "";
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function getAllUsersAdmin(): Promise<UserDoc[]> {
  const col = await usersCollection();
  return col.find({}, { sort: { createdAt: -1 } }).toArray();
}

export async function getPendingUsers(): Promise<UserDoc[]> {
  const col = await usersCollection();
  return col.find({ status: "pending" }, { sort: { createdAt: 1 } }).toArray();
}

export async function getPendingVideos(): Promise<{
  user: UserDoc;
  video: Video;
}[]> {
  const col = await usersCollection();
  const docs = await col
    .find({ "videos.status": "pending" }, { sort: { updatedAt: 1 } })
    .toArray();
  const out: { user: UserDoc; video: Video }[] = [];
  for (const u of docs) {
    for (const v of u.videos) {
      if (v.status === "pending") out.push({ user: u, video: v });
    }
  }
  // Sort by oldest pending first
  out.sort((a, b) => a.video.submittedAt.getTime() - b.video.submittedAt.getTime());
  return out;
}

export async function setUserStatus(
  userId: string,
  status: ModerationStatus,
  reason?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const col = await usersCollection();
  const update: Partial<UserDoc> = {
    status,
    reviewedAt: new Date(),
    updatedAt: new Date(),
  };
  if ((status === "rejected" || status === "suspended") && reason) {
    update.rejectionReason = reason;
  }
  if (status === "approved" || status === "pending") {
    update.rejectionReason = undefined;
  }
  await col.updateOne({ _id: new ObjectId(userId) }, { $set: update });
  return { ok: true };
}

/** Hard delete a user from the database. Cannot be undone. */
export async function deleteUser(
  userId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const col = await usersCollection();
  const result = await col.deleteOne({ _id: new ObjectId(userId) });
  if (result.deletedCount === 0) {
    return { ok: false, error: "Utilisateur introuvable" };
  }
  return { ok: true };
}

export async function setVideoStatus(
  userId: string,
  videoId: string,
  status: ModerationStatus,
  reason?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const col = await usersCollection();
  const update: Record<string, unknown> = {
    "videos.$.status": status,
    "videos.$.reviewedAt": new Date(),
    updatedAt: new Date(),
  };
  if (status === "rejected" && reason) {
    update["videos.$.rejectionReason"] = reason;
  } else {
    update["videos.$.rejectionReason"] = undefined;
  }
  await col.updateOne(
    { _id: new ObjectId(userId), "videos.id": videoId },
    { $set: update },
  );
  return { ok: true };
}

export async function removeVideo(
  userId: string,
  videoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID invalide" };
  const col = await usersCollection();
  await col.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { videos: { id: videoId } }, $set: { updatedAt: new Date() } },
  );
  return { ok: true };
}
