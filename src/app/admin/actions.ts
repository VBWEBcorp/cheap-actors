"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  deleteUser,
  getUserById,
  isSuperAdmin,
  removeVideo,
  setUserStatus,
  setVideoStatus,
  type ModerationStatus,
} from "@/lib/users";
import { DEMO_MODE } from "@/lib/demo";

async function requireAdmin(): Promise<void> {
  if (DEMO_MODE) return; // demo mode: open access (no real DB writes anyway in mocks)
  const session = await auth();
  const email = session?.user?.email;
  if (!isSuperAdmin(email)) {
    throw new Error("Non autorisé");
  }
}

function isMockId(id: string): boolean {
  return id.startsWith("demo-");
}

export async function moderateUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "") as ModerationStatus;
  const reason = String(formData.get("reason") ?? "").trim();
  if (!["pending", "approved", "rejected", "suspended"].includes(status)) return;
  // Skip DB write for demo mock IDs.
  if (isMockId(userId)) {
    revalidatePath("/admin");
    return;
  }
  await setUserStatus(userId, status, reason || undefined);

  revalidatePath("/admin");
  revalidatePath("/acteurs");
  const u = await getUserById(userId);
  if (u) revalidatePath(`/acteurs/${u.slug}`);
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (isMockId(userId)) {
    revalidatePath("/admin");
    return;
  }
  const u = await getUserById(userId);
  await deleteUser(userId);

  revalidatePath("/admin");
  revalidatePath("/acteurs");
  if (u) revalidatePath(`/acteurs/${u.slug}`);
}

export async function moderateVideoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const videoId = String(formData.get("videoId") ?? "");
  const status = String(formData.get("status") ?? "") as ModerationStatus;
  const reason = String(formData.get("reason") ?? "").trim();
  if (!["pending", "approved", "rejected"].includes(status)) return;
  if (isMockId(userId)) {
    revalidatePath("/admin");
    return;
  }
  await setVideoStatus(userId, videoId, status, reason || undefined);

  revalidatePath("/admin");
  const u = await getUserById(userId);
  if (u) revalidatePath(`/acteurs/${u.slug}`);
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const videoId = String(formData.get("videoId") ?? "");
  if (isMockId(userId)) {
    revalidatePath("/admin");
    return;
  }
  await removeVideo(userId, videoId);

  revalidatePath("/admin");
  const u = await getUserById(userId);
  if (u) revalidatePath(`/acteurs/${u.slug}`);
}
