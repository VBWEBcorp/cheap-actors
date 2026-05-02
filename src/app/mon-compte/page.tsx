import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { getUserById, toPublicUser } from "@/lib/users";
import {
  MAX_VIDEOS_PER_FORMAT,
  type ModerationStatus,
  type PublicUser,
} from "@/lib/user-types";
import { DEMO_MODE, DEMO_USER } from "@/lib/demo";
import { ProfileForm } from "./profile-form";
import { VideoManager } from "./video-manager";
import { LogoutButton } from "./logout-button";

export const metadata = {
  title: "Mon compte",
  description: "Modifiez votre fiche, gérez vos vidéos.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function StatusPill({
  status,
  isDemo,
}: {
  status: ModerationStatus;
  isDemo: boolean;
}) {
  if (isDemo) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-flame/40 bg-flame/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-flame">
        <span className="h-1 w-1 rounded-full bg-flame animate-pulse" />
        Mode démo
      </span>
    );
  }
  const map = {
    pending: {
      label: "En attente",
      class: "border-flame/40 bg-flame/5 text-flame",
    },
    approved: {
      label: "Validé",
      class: "border-emerald-700/40 bg-emerald-700/5 text-emerald-700",
    },
    suspended: {
      label: "Suspendu",
      class: "border-amber-700/40 bg-amber-700/5 text-amber-700",
    },
    rejected: {
      label: "Refusé",
      class: "border-smoke/40 bg-smoke/5 text-smoke",
    },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${m.class}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export default async function MonComptePage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  let userId: string | undefined;
  try {
    const session = await auth();
    userId = (session?.user as { id?: string } | undefined)?.id;
  } catch (err) {
    console.warn("[mon-compte] auth() failed:", err);
  }

  let publicUser: PublicUser;
  let email: string;
  let isDemo = false;

  if (userId) {
    const user = await getUserById(userId);
    if (!user) redirect("/connexion");
    publicUser = toPublicUser(user);
    email = user.email;
  } else if (DEMO_MODE) {
    publicUser = DEMO_USER;
    email = "demo@cheap-actors.com";
    isDemo = true;
  } else {
    redirect("/connexion?from=/mon-compte");
  }

  const { welcome } = await searchParams;
  const isWelcome = welcome === "1";

  const horizontal = publicUser.videos.filter((v) => v.format === "horizontal");
  const vertical = publicUser.videos.filter((v) => v.format === "vertical");
  const totalVideos = horizontal.length + vertical.length;
  const maxVideos = MAX_VIDEOS_PER_FORMAT * 2;

  const isApproved = publicUser.status === "approved" || isDemo;
  const isPending = publicUser.status === "pending" && !isDemo;
  const isRejected = publicUser.status === "rejected" && !isDemo;
  const isSuspended = publicUser.status === "suspended" && !isDemo;

  return (
    <article className="relative pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        {/* Welcome flash */}
        {isWelcome && (
          <div className="mb-6 border border-flame/40 bg-flame/5 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
            ✓ Compte créé. Remplissez votre fiche, on validera ensuite.
          </div>
        )}

        {/* Pending banner */}
        {isPending && (
          <div className="mb-6 border border-flame/30 bg-flame/[0.04] px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
              ●  En attente de validation
            </p>
            <p className="mt-1 text-sm text-ink">
              On vérifie votre profil avant de le publier. Profitez-en pour le
              remplir au mieux.
            </p>
          </div>
        )}

        {/* Rejected banner */}
        {isRejected && (
          <div className="mb-6 border border-flame/40 bg-flame/5 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-flame">
              ✗ Compte refusé
            </p>
            {publicUser.rejectionReason && (
              <p className="mt-1 text-sm">« {publicUser.rejectionReason} »</p>
            )}
            <p className="mt-1 text-sm text-smoke">
              Modifiez votre profil et écrivez-nous : hello@cheap-actors.com
            </p>
          </div>
        )}

        {/* Suspended banner */}
        {isSuspended && (
          <div className="mb-6 border border-amber-700/40 bg-amber-700/5 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-700">
              ⏸  Fiche suspendue
            </p>
            {publicUser.rejectionReason && (
              <p className="mt-1 text-sm">« {publicUser.rejectionReason} »</p>
            )}
            <p className="mt-1 text-sm text-smoke">
              Votre fiche est temporairement masquée. Écrivez-nous : hello@cheap-actors.com
            </p>
          </div>
        )}

        {/* Hero */}
        <header className="grid grid-cols-12 gap-4 border-b border-ink/15 pb-6">
          <div className="col-span-12 sm:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              {(publicUser.roles ?? []).join(" · ") || "Rôle non défini"}
            </p>
            <h1 className="mt-2 font-display font-black leading-[0.9] tracking-tight text-[clamp(36px,7vw,80px)]">
              {publicUser.displayName}
            </h1>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">
              {email}
            </p>
          </div>
          <div className="col-span-12 flex items-start justify-between gap-4 sm:col-span-4 sm:flex-col sm:items-end sm:justify-between">
            <StatusPill status={publicUser.status} isDemo={isDemo} />
            {!isDemo && <LogoutButton />}
          </div>
        </header>

        {/* Public link bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-ink/[0.03] px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              Lien public
            </span>
            <span className="break-all font-mono text-xs">
              cheap-actors.com/acteurs/<span className="text-ink">{publicUser.slug}</span>
            </span>
          </div>
          {isApproved ? (
            <Link
              href={`/acteurs/${publicUser.slug}`}
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-flame transition hover:text-ink"
            >
              Voir ma fiche
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
              non publié
            </span>
          )}
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Format horizontal" value={`${horizontal.length} / ${MAX_VIDEOS_PER_FORMAT}`} />
          <Stat label="Format vertical" value={`${vertical.length} / ${MAX_VIDEOS_PER_FORMAT}`} />
          <Stat label="Vidéos publiques" value={`${publicUser.videos.filter((v) => v.status === "approved").length}`} />
          <Stat label="En attente" value={`${publicUser.videos.filter((v) => v.status === "pending").length}`} accent />
        </div>

        {/* Two big sections */}
        <Section number="01" title="Votre profil" subtitle="Tout est modifiable. Tout est public.">
          <ProfileForm initial={publicUser} />
        </Section>

        <Section
          number="02"
          title="Vos vidéos"
          subtitle={`${totalVideos} / ${maxVideos} · YouTube uniquement, pas d'upload`}
        >
          <VideoManager
            horizontal={horizontal}
            vertical={vertical}
            maxPerFormat={MAX_VIDEOS_PER_FORMAT}
          />
        </Section>

        {/* Footer help */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-ink/15 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
          <span>Une question ? hello@cheap-actors.com</span>
          <Link href="/manifeste" className="link-underline">
            Lire le manifeste →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-ink/10 px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl font-bold tracking-tight md:text-2xl ${accent && value !== "0" ? "text-flame" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 md:mt-20">
      <header className="mb-6 flex items-end justify-between gap-4 border-t border-ink/15 pt-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
            {number}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-smoke sm:block">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
