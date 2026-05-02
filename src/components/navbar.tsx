"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { DemoLoginModal } from "./demo-login-modal";

const links = [
  { href: "/shorts", label: "Shorts", n: "01" },
  { href: "/acteurs", label: "Acteurs", n: "02" },
  { href: "/manifeste", label: "Manifeste", n: "03" },
];

export type NavbarAuth = {
  loggedIn: boolean;
  isSuperAdmin: boolean;
  displayName?: string;
};

export function Navbar({
  auth,
  demoMode = false,
}: {
  auth: NavbarAuth;
  demoMode?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDemoLogin = () => {
    setOpen(false);
    setDemoModalOpen(true);
  };

  // Pill button styling, flips between mix-blend-paper (top of page) and ink-on-cream (scrolled)
  const pillBase = scrolled
    ? "md:border md:border-ink/30 md:hover:border-ink md:hover:bg-ink md:hover:text-paper"
    : "md:border md:border-paper/30 md:hover:border-paper md:hover:bg-paper md:hover:text-ink";
  const pillActive = scrolled
    ? "md:border-ink md:bg-ink md:text-paper"
    : "md:border-paper md:bg-paper md:text-ink";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
          scrolled
            ? "border-b border-ink/10 bg-paper/80 backdrop-blur-md"
            : "mix-blend-difference",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-[1800px] items-center justify-between px-5 md:px-10",
            scrolled ? "text-ink" : "text-paper",
          )}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-baseline gap-2 leading-none"
          >
            <span className="font-display text-[22px] font-black tracking-tight">
              cheap
            </span>
            <span className="font-display text-[22px] font-black italic tracking-tight">
              actors
            </span>
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-flame" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]"
                >
                  <span className="mr-1.5 font-mono text-[9px] opacity-50">
                    {link.n}
                  </span>
                  <span className="link-underline">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-2"
                      className="absolute -bottom-px left-3 right-3 h-px bg-current"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {auth.loggedIn ? (
              <Link
                href="/mon-compte"
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition md:px-4",
                  pillBase,
                  pathname.startsWith("/mon-compte") && pillActive,
                )}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Mon compte</span>
                <span className="md:hidden link-underline">Mon compte</span>
              </Link>
            ) : demoMode ? (
              <button
                type="button"
                onClick={openDemoLogin}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition md:px-4",
                  pillBase,
                )}
              >
                <span className="hidden md:inline">Connexion</span>
                <span className="md:hidden link-underline">Connexion</span>
                <span className="text-flame">●</span>
              </button>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="hidden px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] md:inline-block"
                >
                  <span className="link-underline">Connexion</span>
                </Link>
                <Link
                  href="/creer-un-compte"
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition md:px-4",
                    pillBase,
                    pathname.startsWith("/creer-un-compte") && pillActive,
                  )}
                >
                  <span className="hidden md:inline">Créer un compte</span>
                  <span className="md:hidden link-underline">S'inscrire</span>
                  <span className="text-flame">●</span>
                </Link>
              </>
            )}

            <button
              aria-label="Menu"
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer, outside the mix-blend-difference header */}
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-16 z-40 overflow-hidden bg-paper text-ink shadow-lg md:hidden"
      >
        <nav className="flex flex-col px-5 py-2">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-baseline gap-3 border-b border-ink/10 py-4 font-display text-2xl font-black tracking-tight",
                  active && "text-flame",
                )}
              >
                <span className="font-mono text-[10px] tracking-tight text-smoke">
                  {link.n}
                </span>
                {link.label}
              </Link>
            );
          })}

          {auth.loggedIn ? (
            <Link
              href="/mon-compte"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-between gap-3 border border-ink px-5 py-4 font-display text-xl font-black tracking-tight"
            >
              Mon compte
              <User className="h-4 w-4" />
            </Link>
          ) : demoMode ? (
            <button
              type="button"
              onClick={openDemoLogin}
              className="mt-2 inline-flex items-center justify-between gap-3 bg-ink px-5 py-4 text-left font-display text-xl font-black tracking-tight text-paper"
            >
              Connexion
              <span className="text-flame">●</span>
            </button>
          ) : (
            <>
              <Link
                href="/connexion"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-between gap-3 border border-ink px-5 py-4 font-display text-xl font-black tracking-tight"
              >
                Connexion
              </Link>
              <Link
                href="/creer-un-compte"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-between gap-3 bg-ink px-5 py-4 font-display text-xl font-black tracking-tight text-paper"
              >
                Créer un compte
                <span className="text-flame">●</span>
              </Link>
            </>
          )}
        </nav>
      </motion.div>

      <DemoLoginModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </>
  );
}
