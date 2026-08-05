import type { MetadataRoute } from "next";
import { siteUrl } from "./site-config";

const latestContentUpdate = new Date("2026-08-05T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: latestContentUpdate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/radar`,
      lastModified: latestContentUpdate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
