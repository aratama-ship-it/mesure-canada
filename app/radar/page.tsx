import type { Metadata } from "next";
import { FestivalRadarLedger } from "../OpportunityWorkbench";

export const metadata: Metadata = {
  title: "MESURE — Canada | Registre de veille des appels artistiques",
  description: "Le registre officiel de suivi MESURE pour les festivals, marchés, résidences et appels artistiques au Canada et à l’international.",
};

export default function RadarPage() {
  return <FestivalRadarLedger />;
}
