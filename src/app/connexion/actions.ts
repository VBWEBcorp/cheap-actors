"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export type LoginState = {
  error?: string;
  values?: { email?: string };
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/mon-compte");

  if (!email || !password) {
    return { error: "Email et mot de passe requis", values: { email } };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Identifiants incorrects", values: { email } };
  }

  redirect(from || "/mon-compte");
}
