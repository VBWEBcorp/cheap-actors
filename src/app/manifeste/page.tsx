import { ManifesteClient } from "./manifeste-client";

export const metadata = {
  title: "Manifeste",
  description: "Pourquoi Cheap Actors existe.",
};

export default function ManifestePage() {
  return <ManifesteClient />;
}
