import type { Metadata } from "next";
import { FestivalRadarLedger } from "../OpportunityWorkbench";
import { socialImagePath } from "../site-config";

const title = "MESURE — Canada | Registre de veille des appels artistiques";
const description = "Le registre officiel de suivi MESURE pour les festivals, marchés, résidences et appels artistiques au Canada, aux États-Unis et à l’international.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/radar" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_CA",
    url: "/radar",
    images: [{ url: socialImagePath, width: 1731, height: 909, alt: "MESURE — Registre de veille des appels artistiques" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImagePath],
  },
};

export default function RadarPage() {
  return <FestivalRadarLedger />;
}
