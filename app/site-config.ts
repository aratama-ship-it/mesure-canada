export const defaultSiteUrl = "https://mesure.art-monosashi.com";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/$/, "");
export const socialImagePath = "/og-opportunities.png";
