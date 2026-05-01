"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { youtubeThumbUrl } from "@/lib/youtube";
import { YouTubePlayer } from "@/components/youtube-player";
import { cn } from "@/lib/cn";

type Video = {
  id: string;
  title: string;
  youtubeId: string;
  format: "horizontal" | "vertical";
  year?: number;
  description?: string;
};

export function PersonVideoPlayer({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group block w-full text-left"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-chalk",
            video.format === "vertical" ? "aspect-[9/16]" : "aspect-video",
          )}
        >
          <Image
            src={youtubeThumbUrl(video.youtubeId)}
            alt={video.title}
            fill
            sizes={video.format === "vertical" ? "(max-width: 768px) 100vw, 25vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-ink/15 transition group-hover:bg-ink/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink shadow-lg transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
              <Play className="h-5 w-5 fill-current md:h-7 md:w-7" />
            </span>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-paper/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-flame" />
            {video.format}
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight md:text-2xl">
            {video.title}
          </h3>
          {video.year && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke shrink-0">
              {video.year}
            </span>
          )}
        </div>
        {video.description && (
          <p className="mt-1 max-w-md font-display text-sm italic text-smoke md:text-base">
            {video.description}
          </p>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-label={`Lecteur ${video.title}`}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative w-full",
                video.format === "vertical" ? "max-w-md" : "max-w-6xl",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="absolute -top-12 right-0 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-paper transition hover:text-flame"
              >
                Fermer
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/30">
                  <X className="h-3.5 w-3.5" />
                </span>
              </button>
              <YouTubePlayer
                youtubeId={video.youtubeId}
                aspect={video.format === "vertical" ? "vertical" : "video"}
                title={video.title}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
