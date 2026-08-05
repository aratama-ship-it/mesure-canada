import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const title = "MESURE — Canada + États-Unis | Appels artistiques et financement";
const description =
  "Un radar d’appels artistiques et de financement au Canada et aux États-Unis, relié aux sources officielles, au lieu de résidence et aux conditions d’admissibilité.";
const defaultSiteUrl = "https://mesure-quebec.juggler-arata.chatgpt.site";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
const imagePath = "/og-opportunities.png";
const cloudflareAnalyticsToken =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim() ||
  "a9e4947d29da412f924d67897808da7a";
const cloudflareAnalyticsEnabled = /^[0-9a-f]{32}$/i.test(
  cloudflareAnalyticsToken,
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_CA",
    images: [{ url: imagePath, width: 1731, height: 909, alt: "MESURE — Canada + États-Unis · Appels artistiques et financement" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        {cloudflareAnalyticsEnabled ? (
          <Script
            id="cloudflare-web-analytics"
            strategy="afterInteractive"
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: cloudflareAnalyticsToken.toLowerCase(),
            })}
          />
        ) : null}
      </body>
    </html>
  );
}
