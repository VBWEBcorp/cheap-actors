import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getAllUsersAdmin,
  getPendingUsers,
  getPendingVideos,
  isSuperAdmin,
  type UserDoc,
} from "@/lib/users";
import type { UserModerationData } from "@/lib/user-types";
import { DEMO_MODE, DEMO_PENDING_USERS, DEMO_PENDING_VIDEOS } from "@/lib/demo";
import { UserModerationCard } from "./user-moderation-card";
import { VideoModerationCard } from "./video-moderation-card";
import { AccountControlCard } from "./account-control-card";

function serializeUser(u: UserDoc): UserModerationData {
  return {
    id: u._id.toString(),
    email: u.email,
    displayName: u.displayName,
    slug: u.slug,
    roles: u.roles ?? [],
    bio: u.bio,
    tagline: u.tagline,
    basedIn: u.basedIn,
    born: u.born,
    photoUrl: u.photoUrl,
    videos: u.videos,
    status: u.status,
    rejectionReason: u.rejectionReason,
    createdAt: u.createdAt.toISOString(),
  };
}

export const metadata = { title: "Admin" };
export const revalidate = 0;

export default async function AdminPage() {
  let email: string | null | undefined;
  try {
    const session = await auth();
    email = session?.user?.email;
  } catch (err) {
    console.warn("[admin] auth() failed:", err);
  }
  const isDemo = DEMO_MODE && !isSuperAdmin(email);

  if (!isSuperAdmin(email) && !DEMO_MODE) {
    redirect("/");
  }

  let pendingUsersDocs: UserDoc[] = [];
  let pendingVideosLive: { user: UserDoc; video: UserDoc["videos"][number] }[] = [];
  let allUsersDocs: UserDoc[] = [];
  try {
    [pendingUsersDocs, pendingVideosLive, allUsersDocs] = await Promise.all([
      getPendingUsers(),
      getPendingVideos(),
      getAllUsersAdmin(),
    ]);
  } catch (err) {
    console.error("DB unavailable in /admin:", err);
  }

  const pendingUsers: UserModerationData[] = isDemo
    ? [...pendingUsersDocs.map(serializeUser), ...DEMO_PENDING_USERS]
    : pendingUsersDocs.map(serializeUser);

  const pendingVideos = isDemo
    ? [
        ...pendingVideosLive.map((p) => ({
          userId: p.user._id.toString(),
          userName: p.user.displayName,
          userSlug: p.user.slug,
          video: p.video,
        })),
        ...DEMO_PENDING_VIDEOS,
      ]
    : pendingVideosLive.map((p) => ({
        userId: p.user._id.toString(),
        userName: p.user.displayName,
        userSlug: p.user.slug,
        video: p.video,
      }));

  // Show all users for the "Tous les comptes" panel.
  // In demo mode, supplement with pending mocks so the panel isn't empty.
  const allUsers: UserModerationData[] = isDemo
    ? [...allUsersDocs.map(serializeUser), ...DEMO_PENDING_USERS]
    : allUsersDocs.map(serializeUser);

  const stats = {
    total: allUsers.length,
    pending: allUsers.filter((u) => u.status === "pending").length,
    approved: allUsers.filter((u) => u.status === "approved").length,
    suspended: allUsers.filter((u) => u.status === "suspended").length,
    rejected: allUsers.filter((u) => u.status === "rejected").length,
    totalVideos: allUsers.reduce((acc, u) => acc + u.videos.length, 0),
    pendingVideos: allUsers.reduce(
      (acc, u) => acc + u.videos.filter((v) => v.status === "pending").length,
      0,
    ),
  };

  return (
    <article className="relative pb-24 pt-24 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 pb-6">
          <p className="col-span-6 font-mono text-[10px] uppercase tracking-[0.28em] text-flame md:col-span-3">
            ●  Console créateur {isDemo && "(démo)"}
          </p>
          <p className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-9">
            {email ?? "demo@cheap-actors.com"}
          </p>
        </div>

        <h1 className="mt-8 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(40px,8vw,120px)]">
          Console<span className="text-flame">.</span>
        </h1>
        <p className="mt-3 max-w-2xl font-display text-lg italic md:text-xl">
          Tout. Tout le temps. Sans demander la permission à personne.
        </p>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-7 md:mt-14">
          <Stat label="Total" value={stats.total} />
          <Stat label="En attente" value={stats.pending} accent={stats.pending > 0} />
          <Stat label="Validés" value={stats.approved} />
          <Stat label="Suspendus" value={stats.suspended} />
          <Stat label="Refusés" value={stats.rejected} />
          <Stat label="Vidéos" value={stats.totalVideos} />
          <Stat label="Vid. attente" value={stats.pendingVideos} accent={stats.pendingVideos > 0} />
        </section>

        {/* Quick: Pending users */}
        {pendingUsers.length > 0 && (
          <section className="mt-16 md:mt-20">
            <header className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                À valider — comptes
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
                {String(pendingUsers.length).padStart(2, "0")} en attente
              </p>
            </header>
            <ul className="grid gap-4">
              {pendingUsers.map((u) => (
                <li key={u.id}>
                  <UserModerationCard user={u} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quick: Pending videos */}
        {pendingVideos.length > 0 && (
          <section className="mt-16 md:mt-20">
            <header className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                À valider — vidéos
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
                {String(pendingVideos.length).padStart(2, "0")} en attente
              </p>
            </header>
            <ul className="grid gap-4 md:grid-cols-2">
              {pendingVideos.map(({ userId, userName, userSlug, video }) => (
                <li key={`${userId}-${video.id}`}>
                  <VideoModerationCard
                    userId={userId}
                    userName={userName}
                    userSlug={userSlug}
                    video={video}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* All accounts: full control */}
        <section className="mt-16 md:mt-24">
          <header className="mb-6 flex items-end justify-between">
            <h2 className="font-display font-black leading-[0.95] tracking-tight text-[clamp(28px,5vw,56px)]">
              Tous les comptes.
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              {String(allUsers.length).padStart(2, "0")} au total
            </p>
          </header>

          {allUsers.length === 0 ? (
            <p className="border border-ink/10 bg-ink/[0.02] p-8 text-center font-display text-lg italic text-smoke md:p-12">
              La base est vide. Il faut bien commencer.
            </p>
          ) : (
            <ul className="grid gap-3">
              {allUsers.map((u) => (
                <li key={u.id}>
                  <AccountControlCard user={u} />
                </li>
              ))}
            </ul>
          )}
        </section>
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
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="border border-ink/10 px-3 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl font-black tracking-tight md:text-2xl ${accent && value > 0 ? "text-flame" : ""}`}
      >
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}
