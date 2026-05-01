import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPersonViewBySlug, type PersonView } from "@/lib/person-view";
import { posterFor } from "@/lib/catalog";
import { PersonAvatar } from "@/components/person-avatar";
import { PersonVideoPlayer } from "./video-player";
import { ShareCard } from "./share-card";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPersonViewBySlug(slug);
  if (!p) return {};
  const rolesLabel = p.roles.join(" · ");
  return {
    title: `${p.name} — ${rolesLabel}`,
    description: p.tagline || `${p.name}, ${rolesLabel}, sur Cheap Actors.`,
  };
}

export default async function PersonnePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = await getPersonViewBySlug(slug);
  if (!person) notFound();

  const horizontalVideos = person.videos.filter((v) => v.format === "horizontal");
  const verticalVideos = person.videos.filter((v) => v.format === "vertical");

  const totalAppearances = person.videos.length + person.filmAppearances.length;
  const apparitionsLabel =
    totalAppearances === 0
      ? "fiche en cours"
      : totalAppearances === 1
        ? "1 apparition"
        : `${totalAppearances} apparitions`;

  return (
    <article className="relative pb-24 pt-28 md:pt-32">
      <div className="mx-auto max-w-[1800px] px-5 md:px-10">
        <Link
          href="/acteurs"
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
          Toutes les fiches
        </Link>

        {/* Header meta */}
        <div className="mt-8 grid grid-cols-12 gap-4 border-b border-ink/15 pb-6">
          <p className="col-span-6 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
            ●  Fiche {person.roles.join(" + ")}
          </p>
          <p className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-9">
            {person.basedIn ?? "Quelque part"}
            {person.born && ` · né·e en ${person.born}`}
            {` · ${apparitionsLabel}`}
          </p>
        </div>

        {/* Big name + portrait */}
        <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-10 md:mt-14">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-flame">
              {person.roles.join(" · ")}
            </p>
            <h1 className="mt-3 font-display font-black leading-[0.86] tracking-[-0.04em] text-[clamp(56px,12vw,200px)]">
              {person.name}
            </h1>
            {person.tagline && (
              <p className="mt-6 max-w-2xl font-display text-2xl italic md:text-3xl">
                « {person.tagline} »
              </p>
            )}
          </div>
          <div className="col-span-12 sm:col-span-7 md:col-span-5 lg:col-span-4">
            <PortraitOrPlaceholder person={person} />
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-32">
            <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke md:col-span-3">
              ¶  Notice
            </p>
            <div className="col-span-12 md:col-span-9">
              <p className="font-display leading-[1.2] tracking-tight text-[clamp(20px,2.6vw,36px)]">
                {person.bio}
              </p>
            </div>
          </div>
        )}

        {/* Stats grid */}
        {(person.videos.length > 0 || person.filmAppearances.length > 0 || person.funFact) && (
          <div className="mt-16 grid grid-cols-2 gap-4 border-y border-ink/15 py-6 sm:grid-cols-4 md:mt-24 md:py-8">
            <Stat label="Vidéos" value={String(person.videos.length).padStart(2, "0")} />
            <Stat label="Format horizontal" value={String(horizontalVideos.length)} />
            <Stat label="Format vertical" value={String(verticalVideos.length)} />
            {person.funFact ? (
              <Stat label="À savoir" value={person.funFact} small />
            ) : (
              <Stat label="Fiche source" value={person.source === "db" ? "Compte vérifié" : "Sélection éditoriale"} small />
            )}
          </div>
        )}

        {/* DB videos */}
        {person.source === "db" && person.videos.length > 0 && (
          <>
            {horizontalVideos.length > 0 && (
              <VideoSection
                title="Format horizontal."
                subtitle="Courts-métrages, films, scènes longues."
                videos={horizontalVideos}
              />
            )}
            {verticalVideos.length > 0 && (
              <VideoSection
                title="Format vertical."
                subtitle="Shorts, fragments, formats verticaux."
                videos={verticalVideos}
              />
            )}
          </>
        )}

        {/* Empty state for new DB users */}
        {person.source === "db" && person.videos.length === 0 && (
          <section className="mt-20 border border-ink/15 bg-paper p-8 text-center md:mt-32 md:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
              ●  Aucune vidéo
            </p>
            <h3 className="mt-4 font-display font-black leading-tight tracking-tight text-[clamp(28px,4vw,56px)]">
              {person.name} n'a pas encore <br />
              <span className="italic font-medium">posté ses vidéos.</span>
            </h3>
            <p className="mt-4 text-sm text-smoke">
              Ça viendra. Ou pas.
            </p>
          </section>
        )}

        {/* Static catalog film appearances */}
        {person.filmAppearances.length > 0 && (
          <section className="mt-20 md:mt-32">
            <div className="mb-8 flex items-end justify-between md:mb-10">
              <h2 className="font-display font-black leading-[0.95] tracking-tight text-[clamp(32px,5vw,64px)]">
                À l'affiche.
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
                {apparitionsLabel}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {person.filmAppearances.map((f, i) => (
                <li key={f.id}>
                  <Link
                    href={
                      f.format === "film"
                        ? `/films/${f.slug}`
                        : `/shorts?id=${f.id}`
                    }
                    className="group block"
                  >
                    <div className="relative aspect-video overflow-hidden bg-chalk">
                      <Image
                        src={posterFor(f)}
                        alt={f.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <span className="absolute right-3 top-3 flex items-center gap-1.5 bg-paper/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
                        <span className="h-1 w-1 rounded-full bg-flame" />
                        {f.format === "film" ? "Film" : "Short"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-2xl font-bold tracking-tight">
                        {f.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">
                      {f.year} · {f.durationMin} min
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Share / vanity */}
        <ShareCard slug={person.slug} />

        {/* Footer nav */}
        <nav className="mt-20 flex items-center justify-between border-t border-ink/15 pt-8 md:mt-24">
          <Link
            href="/acteurs"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
            Annuaire
          </Link>
          <Link
            href="/films"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-smoke transition hover:text-ink"
          >
            Programme
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </nav>
      </div>
    </article>
  );
}

function PortraitOrPlaceholder({ person }: { person: PersonView }) {
  if (person.photoUrl) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-chalk">
        <Image
          src={person.photoUrl}
          alt={person.name}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover grayscale"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1.5 bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-flame" />
          {person.roles.join(" · ")}
        </span>
      </div>
    );
  }
  return (
    <PersonAvatar
      person={{
        slug: person.slug,
        name: person.name,
        job: person.roles[0],
        tagline: person.tagline,
        bio: person.bio,
      }}
      size="xl"
    />
  );
}

function Stat({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
      </p>
      <p
        className={
          small
            ? "mt-2 font-display text-base italic leading-snug"
            : "mt-2 font-display text-3xl font-black tracking-tight md:text-4xl"
        }
      >
        {value}
      </p>
    </div>
  );
}

function VideoSection({
  title,
  subtitle,
  videos,
}: {
  title: string;
  subtitle: string;
  videos: { id: string; title: string; youtubeId: string; format: "horizontal" | "vertical"; year?: number; description?: string }[];
}) {
  return (
    <section className="mt-20 md:mt-32">
      <div className="mb-8 flex items-end justify-between md:mb-10">
        <h2 className="font-display font-black leading-[0.95] tracking-tight text-[clamp(28px,4vw,56px)]">
          {title}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
          {subtitle}
        </p>
      </div>
      <ul
        className={`grid gap-6 ${
          videos[0]?.format === "vertical"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {videos.map((v) => (
          <li key={v.id}>
            <PersonVideoPlayer video={v} />
          </li>
        ))}
      </ul>
    </section>
  );
}
