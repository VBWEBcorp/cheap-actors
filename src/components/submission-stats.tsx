import {
  SITE_STATS,
  getAcceptanceRate,
  formatVolume,
} from "@/lib/site-stats";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "compact" | "expanded";
  className?: string;
};

export function SubmissionStats({ variant = "compact", className }: Props) {
  const rate = getAcceptanceRate();
  const totalSelected = SITE_STATS.filmsSelected + SITE_STATS.shortsSelected;

  if (variant === "compact") {
    return (
      <p
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.22em] text-smoke",
          className,
        )}
      >
        ●  {formatVolume(SITE_STATS.currentVolume)} ·{" "}
        <span className="text-ink">{SITE_STATS.submissionsReceived}*</span> reçus ·{" "}
        <span className="text-ink">{totalSelected}</span> retenus ·{" "}
        <span className="text-flame">{rate} %</span>
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-y-6 sm:grid-cols-4", className)}>
      <Stat label="Volume" value={String(SITE_STATS.currentVolume).padStart(2, "0")} />
      <Stat label="Soumissions reçues*" value={`${SITE_STATS.submissionsReceived}`} />
      <Stat label="Retenus" value={String(totalSelected).padStart(2, "0")} />
      <Stat label="Taux d'acceptation" value={`${rate} %`} accent />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-smoke">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display font-black tracking-tight text-[clamp(28px,3vw,48px)]",
          accent && "text-flame",
        )}
      >
        {value}
      </p>
    </div>
  );
}
