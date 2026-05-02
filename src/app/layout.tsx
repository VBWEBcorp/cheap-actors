import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/users";
import { DEMO_MODE } from "@/lib/demo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

// Production URL is read from NEXT_PUBLIC_SITE_URL (set on Netlify), with a
// localhost fallback for dev so og: links don't 404 when shared from a preview.
// We auto-add https:// if missing and fall back gracefully if the env var is
// malformed — Netlify silently strips values it can't parse and `new URL()`
// would otherwise crash the entire build at "collect page data".
function resolveSiteUrl(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const fallback = new URL("http://localhost:3000");
  if (!raw) return fallback;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(candidate);
  } catch {
    return fallback;
  }
}

const SITE_URL_OBJ = resolveSiteUrl();
const SITE_URL = SITE_URL_OBJ.toString().replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: SITE_URL_OBJ,
  title: {
    default: "Cheap Actors · un cinéma qui n'attendait personne",
    template: "%s · Cheap Actors",
  },
  description:
    "Vitrine de courts-métrages et de shorts joués par des acteurs qu'aucun casting n'a rappelés. Sélection humaine, hébergée sur YouTube. Pas connus. Pas chers. Pas mal.",
  applicationName: "Cheap Actors",
  authors: [{ name: "Cheap Actors" }],
  keywords: [
    "courts-métrages",
    "court-métrage",
    "acteurs indépendants",
    "réalisateurs indépendants",
    "cinéma indépendant",
    "shorts",
    "format vertical",
    "casting",
    "acteurs débutants",
    "annuaire acteurs",
    "vitrine cinéma",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cheap Actors · un cinéma qui n'attendait personne",
    description:
      "Des comédien·ne·s que personne n'a rappelés. Et — surprise — c'est plus intéressant que prévu.",
    type: "website",
    locale: "fr_FR",
    siteName: "Cheap Actors",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheap Actors",
    description:
      "Des comédien·ne·s que personne n'a rappelés. Et c'est plus intéressant que prévu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: "#efe9dc",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tolerate stale/corrupt auth cookies (common in dev when AUTH_SECRET changes
  // or the port shifts), render the layout without a session rather than 500.
  //
  // We also skip auth() during prerender (BUILD_STATIC for GH Pages, or
  // NEXT_PHASE=phase-production-build for any platform). auth() reads request
  // headers and triggers a dynamic-server-usage bailout that fails the build
  // when the page would otherwise have been static. At runtime auth() is
  // still called normally, so the navbar reflects the real session.
  let sessionEmail: string | null | undefined;
  let sessionName: string | null | undefined;
  let hasSession = false;
  const isBuildPhase =
    process.env.BUILD_STATIC === "1" ||
    process.env.NEXT_PHASE === "phase-production-build";
  if (!isBuildPhase) {
    try {
      const session = await auth();
      sessionEmail = session?.user?.email;
      sessionName = session?.user?.name;
      hasSession = !!session?.user;
    } catch (err) {
      console.warn("[layout] auth() failed, continuing without session:", err);
    }
  }

  const navAuth = {
    loggedIn: hasSession,
    isSuperAdmin: isSuperAdmin(sessionEmail),
    displayName: sessionName ?? undefined,
  };

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="paper bg-paper text-ink antialiased">
        <Navbar auth={navAuth} demoMode={DEMO_MODE} />
        <main className="relative z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
