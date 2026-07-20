import type { Metadata } from "next";
import "./globals.css";

const title = "MESURE — Canada | Appels et financement culturel";
const description =
  "Un outil de présélection qui relie les appels internationaux aux aides accessibles depuis le Québec et l’Ontario, selon le lieu de résidence et le statut au Canada.";
const defaultSiteUrl = "https://mesure-quebec.juggler-arata.chatgpt.site";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
const imagePath = "/og.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_CA",
    images: [{ url: imagePath, width: 1732, height: 908, alt: "MESURE — Canada" }],
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
