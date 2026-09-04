import type { MetadataRoute } from "next";
import { siteUrl } from "./site-config";

// 静的書き出し（output: export）でビルド時に生成する。
export const dynamic = "force-static";

const latestContentUpdate = new Date("2026-09-04T00:00:00Z");

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
