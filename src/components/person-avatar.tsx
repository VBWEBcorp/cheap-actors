import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Person } from "@/lib/catalog";

type Props = {
  person: Person;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-7xl",
  xl: "text-[clamp(80px,18vw,260px)]",
};

export function PersonAvatar({ person, className, size = "md" }: Props) {
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden bg-chalk",
        className,
      )}
    >
      {person.portrait ? (
        <Image
          src={person.portrait}
          alt={person.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover grayscale"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-display font-black italic leading-none tracking-tight text-ink/85",
              sizeClasses[size],
            )}
          >
            {initials}
          </span>
          <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.28em] text-smoke">
            Photo manquante
          </span>
        </div>
      )}
      <span className="absolute right-2 top-2 flex items-center gap-1.5 bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
        <span className="h-1 w-1 rounded-full bg-flame" />
        {person.job}
      </span>
    </div>
  );
}
