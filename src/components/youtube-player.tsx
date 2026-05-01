"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  youtubeId: string;
  /** autoplay muted in background — for hero teasers */
  background?: boolean;
  /** aspect ratio class — defaults to 16/9 */
  aspect?: "video" | "vertical" | "square";
  className?: string;
  title?: string;
};

export function YouTubePlayer({
  youtubeId,
  background = false,
  aspect = "video",
  className,
  title,
}: Props) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...(background
      ? {
          autoplay: "1",
          mute: "1",
          loop: "1",
          controls: "0",
          showinfo: "0",
          disablekb: "1",
          iv_load_policy: "3",
          playlist: youtubeId,
        }
      : {
          autoplay: "1",
        }),
  });

  const aspectClass =
    aspect === "vertical"
      ? "aspect-[9/16]"
      : aspect === "square"
        ? "aspect-square"
        : "aspect-video";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "relative w-full overflow-hidden bg-ink-800",
        aspectClass,
        className,
      )}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`}
        title={title ?? "Video player"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={cn(
          "absolute inset-0 h-full w-full",
          background && "scale-[1.35] pointer-events-none",
        )}
      />
    </motion.div>
  );
}
