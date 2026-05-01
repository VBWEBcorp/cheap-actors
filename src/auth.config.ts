import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config — used by middleware. Does NOT include
 * the credentials provider's authorize() because it needs bcrypt
 * (Node.js APIs). The full provider config lives in src/auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
  },
  providers: [],
  // Silence JWT decryption errors (stale cookies after AUTH_SECRET / port
  // changes). They're harmless — Auth.js will simply treat the user as
  // logged-out, and the next sign-in writes a fresh cookie.
  logger: {
    error(error) {
      const name = (error as { name?: string }).name;
      const type = (error as { type?: string }).type;
      if (name === "JWTSessionError" || type === "JWTSessionError") return;
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
