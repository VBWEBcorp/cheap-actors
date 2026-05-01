"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { createUser, ROLES, type Role } from "@/lib/users";

export type RegisterState = {
  error?: string;
  values?: {
    email?: string;
    displayName?: string;
    roles?: Role[];
  };
};

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const rolesRaw = formData.getAll("roles").map((v) => String(v));
  const roles = rolesRaw.filter((r): r is Role => ROLES.includes(r as Role));

  const values = { email, displayName, roles };

  if (roles.length === 0) {
    return { error: "Choisissez au moins un rôle", values };
  }
  if (roles.length > 2) {
    return { error: "Maximum 2 rôles", values };
  }

  const result = await createUser({
    email,
    password,
    displayName,
    roles,
  });
  if (!result.ok) {
    return { error: result.error, values };
  }

  // Auto-login after register
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // If auto-login fails, user can still go to /connexion
    redirect("/connexion?registered=1");
  }

  redirect("/mon-compte?welcome=1");
}
