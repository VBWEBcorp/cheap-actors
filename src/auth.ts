import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyPassword } from "@/lib/users";
import { authConfig } from "./auth.config";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await verifyPassword(parsed.data.email, parsed.data.password);
        if (!user) return null;
        return {
          id: user._id.toString(),
          name: user.displayName,
          email: user.email,
        };
      },
    }),
  ],
});
