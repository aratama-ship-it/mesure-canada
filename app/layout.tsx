import type { Metadata } from "next";
import "./globals.css";

const title = "MESURE — Canada + États-Unis | Appels artistiques et financement";
const description =
  "Un radar d’appels artistiques et de financement au Canada et aux États-Unis, relié aux sources officielles, au lieu de résidence et aux conditions d’admissibilité.";
const defaultSiteUrl = "https://mesure-quebec.juggler-arata.chatgpt.site";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
const imagePath = "/og-opportunities.png";

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
      <body>{children}</body>
    </html>
  );
}
