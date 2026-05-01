"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import {
  addVideo,
  getUserById,
  removeVideo,
  updateProfile,
  ROLES,
  TAGS,
  type Role,
  type Tag,
  type VideoFormat,
} from "@/lib/users";
import { extractYoutubeId } from "@/lib/youtube";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Non authentifié");
  return id;
}

export type ProfileState = {
  ok?: boolean;
  error?: string;
};

export async function saveProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Non authentifié" };
  }

  const rolesRaw = formData.getAll("roles").map((v) => String(v));
  const roles = rolesRaw.filter((r): r is Role => ROLES.includes(r as Role));
  if (roles.length === 0) {
    return { error: "Choisissez au moins un rôle" };
  }
  if (roles.length > 2) {
    return { error: "Maximum 2 rôles" };
  }

  const bornRaw = String(formData.get("born") ?? "").trim();
  const bornNum = bornRaw === "" ? undefined : Number(bornRaw);
  const bornValue =
    bornNum !== undefined && !isNaN(bornNum) ? bornNum : undefined;

  const result = await updateProfile(userId, {
    displayName: String(formData.get("displayName") ?? "").trim(),
    roles,
    tagline: String(formData.get("tagline") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim(),
    basedIn: String(formData.get("basedIn") ?? "").trim(),
    born: bornValue,
    funFact: String(formData.get("funFact") ?? "").trim(),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/mon-compte");
  revalidatePath("/acteurs");
  // The slug may have changed; revalidate every personne page.
  // Cheap: revalidate the layout for /acteurs prefix.
  revalidatePath("/acteurs/[slug]", "page");

  return { ok: true };
}

export type VideoState = {
  ok?: boolean;
  error?: string;
};

export async function addVideoAction(
  _prev: VideoState,
  formData: FormData,
): Promise<VideoState> {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return { error: "Non authentifié" };
  }

  const format = String(formData.get("format") ?? "");
  if (format !== "horizontal" && format !== "vertical") {
    return { error: "Format invalide" };
  }

  const rawUrl = String(formData.get("youtubeUrl") ?? "").trim();
  const youtubeId = extractYoutubeId(rawUrl);
  if (!youtubeId) {
    return { error: "URL YouTube invalide. Collez l'URL complète." };
  }

  const yearStr = String(formData.get("year") ?? "").trim();
  const yearNum = yearStr ? Number(yearStr) : undefined;

  const tagsRaw = formData.getAll("tags").map((v) => String(v));
  const tags = tagsRaw.filter((t): t is Tag => (TAGS as readonly string[]).includes(t));

  const result = await addVideo(userId, {
    format: format as VideoFormat,
    title: String(formData.get("title") ?? "").trim(),
    youtubeId,
    coverUrl: String(formData.get("coverUrl") ?? "").trim(),
    year: yearNum,
    description: String(formData.get("description") ?? "").trim(),
    tags: tags.length > 0 ? tags : undefined,
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/mon-compte");
  // Public pages depending on this user's videos
  const u = await getUserById(userId);
  if (u) {
    revalidatePath(`/acteurs/${u.slug}`);
  }
  return { ok: true };
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const videoId = String(formData.get("videoId") ?? "");
  if (!videoId) return;
  await removeVideo(userId, videoId);
  revalidatePath("/mon-compte");
  const u = await getUserById(userId);
  if (u) revalidatePath(`/acteurs/${u.slug}`);
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
