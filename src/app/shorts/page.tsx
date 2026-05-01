import { Suspense } from "react";
import { getShorts } from "@/lib/catalog";
import { ShortsViewer } from "./shorts-viewer";

export const metadata = {
  title: "Shorts",
  description: "Format vertical, format urgent.",
};

export default function ShortsPage() {
  const shorts = getShorts();
  return (
    <Suspense fallback={<div className="h-[100svh] w-full bg-paper" />}>
      <ShortsViewer shorts={shorts} />
    </Suspense>
  );
}
