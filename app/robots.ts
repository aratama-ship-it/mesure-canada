import type { MetadataRoute } from "next";
import { siteUrl } from "./site-config";

// 静的書き出し（output: export）でビルド時に生成する。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
