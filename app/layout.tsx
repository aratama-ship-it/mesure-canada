import type { Metadata } from "next";
import "./globals.css";

const title = "MESURE — Canada | Appels artistiques, festivals et résidences";
const description =
  "Un radar d’appels artistiques au Québec, au Canada et à l’international, relié aux sources officielles et, lorsque les critères le permettent, aux aides pertinentes.";
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
    images: [{ url: imagePath, width: 1731, height: 909, alt: "MESURE — Canada · Appels artistiques, festivals et résidences" }],
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
