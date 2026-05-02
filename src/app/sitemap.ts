import type { MetadataRoute } from "next";
import { people } from "@/lib/catalog";
import { getAllPublicUsers } from "@/lib/users";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cheap-actors.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shorts`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/acteurs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/manifeste`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/soumettre`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Static catalog people
  const staticPeopleEntries: MetadataRoute.Sitemap = people.map((p) => ({
    url: `${SITE_URL}/acteurs/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // DB-approved users (skip if DB unreachable to keep build green)
  let dbUserEntries: MetadataRoute.Sitemap = [];
  try {
    const dbUsers = await getAllPublicUsers();
    dbUserEntries = dbUsers.map((u) => ({
      url: `${SITE_URL}/acteurs/${u.slug}`,
      lastModified: u.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.warn("[sitemap] DB unreachable, skipping DB users:", err);
  }

  return [...staticEntries, ...staticPeopleEntries, ...dbUserEntries];
}
