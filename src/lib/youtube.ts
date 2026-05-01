/**
 * Extract a YouTube video ID from any common URL format.
 * Returns null if the URL is not a recognized YouTube URL.
 *
 * Accepted formats:
 * - https://www.youtube.com/watch?v=XXXXXXXXXXX
 * - https://youtu.be/XXXXXXXXXXX
 * - https://www.youtube.com/shorts/XXXXXXXXXXX
 * - https://www.youtube.com/embed/XXXXXXXXXXX
 * - Just the 11-char ID itself
 */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Just the ID itself
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  // Try to parse as URL
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    const m = url.pathname.match(/^\/(?:shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }

  return null;
}

export const youtubeThumbUrl = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
