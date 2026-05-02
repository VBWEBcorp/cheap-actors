import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const DEMO_MODE = process.env.DEMO_MODE === "1";

export default auth((req) => {
  // Demo mode: let everything through.
  if (DEMO_MODE) return NextResponse.next();

  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect /mon-compte/* and /admin/*
  if ((pathname.startsWith("/mon-compte") || pathname.startsWith("/admin")) && !isLoggedIn) {
    const url = new URL("/connexion", req.nextUrl);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already-logged-in users shouldn't see /connexion or /creer-un-compte
  if (
    (pathname === "/connexion" || pathname === "/creer-un-compte") &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/mon-compte", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/mon-compte/:path*",
    "/admin/:path*",
    "/connexion",
    "/creer-un-compte",
  ],
};
