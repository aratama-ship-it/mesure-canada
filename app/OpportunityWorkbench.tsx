"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import fundingData from "../data/funding.json";
import festivalRadarData from "../data/festival-radar.json";
import opportunityData from "../data/opportunities.json";
import { evaluateFundingEligibility, supportsResidence } from "./eligibility.mjs";

type Language = "fr" | "en" | "ja";
type Profile = "artist" | "collective" | "organization";
type Residence = "montreal" | "quebec_city" | "quebec" | "gatineau" | "toronto" | "gta" | "ottawa";
type ResidenceScope = "canada" | "quebec" | "quebec_city" | "montreal" | "ontario" | "gta" | "toronto" | "ottawa";
type Discipline = "all" | "circus" | "theatre" | "dance" | "music" | "media";
type RadarFamily = "all" | "circus" | "street" | "fringe" | "film" | "showcase";
type RadarSearchTag = "all" | "regional_festival" | "event_performance" | "choreographer_development" | "residency";
type RadarSearchTagKey = Exclude<RadarSearchTag, "all">;
type RadarParticipation = "international" | "open_access" | "selection" | "regional_conditions" | "language_conditions" | "eligibility_check";
type RadarStatus = "open" | "upcoming" | "watch";
type CoverageKey =
  | "travel"
  | "stay"
  | "visa"
  | "transport"
  | "promotion"
  | "market"
  | "touring"
  | "fees"
  | "production"
  | "research"
  | "creation"
  | "recording"
  | "mentorship"
  | "training";
type MatchState = "possible" | "conditional" | "verify" | "ineligible";
type FundingMatchState = Exclude<MatchState, "ineligible">;
type LegalStatus =
  | "citizen"
  | "permanent"
  | "protected"
  | "permanent_pending"
  | "temporary_work"
  | "temporary_no_work"
  | "unsure";
type ProvinceHistory = "twelve_plus" | "under_twelve" | "unsure";
type TorontoHistory = "meets" | "does_not" | "unsure";
type CollectiveComposition =
  | "all"
  | "two_thirds"
  | "majority_qualified"
  | "half_qualified"
  | "under_half"
  | "unsure";
type CollectiveSize = "two" | "three_plus" | "unsure";
type OrganizationRegistration = "yes" | "no" | "unsure";
type YesNoUnsure = "yes" | "no" | "unsure";
type CanadaArrival = "after_2019" | "before_2019" | "unsure";
type AgeBand = "under_18" | "eighteen_thirty" | "over_thirty" | "unsure";
type EligibilityReasonKey =
  | "statusUnknown"
  | "statusNotAccepted"
  | "statusConditional"
  | "statusVerification"
  | "provinceHistoryUnknown"
  | "provinceHistoryTooShort"
  | "torontoHistoryUnknown"
  | "torontoHistoryTooShort"
  | "groupUnknown"
  | "groupNotEnough"
  | "groupSizeUnknown"
  | "organizationUnknown"
  | "organizationNotEligible"
  | "organizationProgramCheck"
  | "sinUnknown"
  | "sinMissing"
  | "arrivalUnknown"
  | "arrivalTooEarly"
  | "ageUnknown"
  | "ageOutOfRange"
  | "professionalPracticeCheck";

type Localized = Record<Language, string>;

type FundingMatch = {
  fundingId: string;
  state: FundingMatchState;
  note: Localized;
};

type RadarFundingReview = {
  status: "suggested" | "reviewed_no_match" | "pending_terms";
  verifiedAt: string;
  note: Localized;
  fundingMatches: FundingMatch[];
};

type FestivalRadar = {
  id: string;
  title: string;
  country: string;
  city: string;
  region: string;
  family: Exclude<RadarFamily, "all">;
  participation: RadarParticipation;
  status: RadarStatus;
  deadlineDate: string | null;
  deadlineLabel: Localized;
  nextCheckDate: string;
  sourceUrl: string;
  networkSourceUrl?: string;
  verifiedAt: string;
  linkedOpportunityId?: string;
  fundingReview?: RadarFundingReview;
};

type Opportunity = {
  id: string;
  title: string;
  organizer: string;
  country: string;
  city: string;
  status: "open" | "rolling" | "upcoming";
  openDate?: string;
  deadlineDate: string | null;
  deadlineLabel: Localized;
  profiles: Profile[];
  disciplines: Exclude<Discipline, "all">[];
  summary: Localized;
  requirements: Record<Language, string[]>;
  applicationLanguages: string[];
  sourceUrl: string;
  verifiedAt: string;
  fundingMatches: FundingMatch[];
};

type CandidateStatus = "open" | "rolling" | "upcoming";
type FundingSection = "direct" | "radar" | "regional";
type CandidateRoute =
  | {
    candidateId: string;
    source: "call";
    status: CandidateStatus;
    opportunity: Opportunity;
  }
  | {
    candidateId: string;
    source: "radar";
    status: Exclude<RadarStatus, "watch">;
    radar: FestivalRadar;
  };

type Funding = {
  id: string;
  name: string;
  funder: string;
  profiles: Profile[];
  residencies: ResidenceScope[];
  disciplines: Discipline[];
  purpose: "mobility_export" | "home_base_creation" | "career_support";
  kind: "grant" | "paid_program";
  availability?: "closed";
  deadline: Localized;
  amount: Localized;
  coverage: CoverageKey[];
  cashflow: Localized;
  eligibility: {
    individualStatuses?: LegalStatus[];
    representativeStatuses?: LegalStatus[];
    conditionalStatuses?: LegalStatus[];
    verificationStatuses?: LegalStatus[];
    minimumProvinceMonths?: 12;
    minimumTorontoMonths?: 12;
    collectiveRule?: "cca_half" | "cam_two_thirds" | "oac_half" | "tac_majority" | "ottawa_half";
    organizationRegisteredInCanada?: true;
    organizationVerificationRequired?: true;
    professionalPracticeVerificationRequired?: true;
    sinRequired?: true;
    arrivalOnOrAfter?: "2019-01-01";
    ageRange?: { min?: 18; max?: 30 };
    note: Localized;
    sourceUrl: string;
    verifiedAt: string;
  };
  sourceUrl: string;
  verifiedAt: string;
};

type Assessment = { state: MatchState; reasonKeys: EligibilityReasonKey[] };

const opportunities = opportunityData as Opportunity[];
const fundingPrograms = fundingData as Funding[];
const festivalRadar = festivalRadarData as FestivalRadar[];
const candidatePageSize = 8;
const fundingPageSize = 3;
const feedbackFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc1pPGdqvVjMyocYNT7q-4JcVkn-c7c__ef1cveCDZ1Jf6hAQ/viewform";

const copy = {
  fr: {
    edition: "Édition Canada · Québec + Ontario",
    ledgerEdition: "Canada · Registre de veille",
    radarLink: "Consulter le registre de veille",
    backToSearch: "Retour à la recherche d’occasions",
    sourceNotice: {
      label: "À propos des informations",
      text: "Les informations sont recueillies et organisées à partir des sources primaires des organisateurs. Elles peuvent différer des informations les plus récentes en raison du délai de mise à jour. Vérifiez toujours les détails sur chaque site officiel.",
    },
    betaNotice: {
      label: "BÊTA",
      before: "Ce site est actuellement en version bêta. Pour nous transmettre une suggestion, un commentaire ou une correction, utilisez",
      link: "le formulaire",
      after: ".",
    },
    eyebrow: "Du Québec aux festivals, scènes et résidences du monde",
    headline: "Trouvez où votre travail peut aller ensuite.",
    intro:
      "Explorez les appels vérifiés du cirque, des arts de la rue, des fringes, de la scène, du cinéma, des vitrines et des résidences. Le financement apparaît ensuite, uniquement lorsqu’un lien peut être étayé par les critères officiels.",
    stamp: `${festivalRadar.length} pistes d’appels au Canada et à l’international · ${opportunities.length} appels avec financement étudié · ${fundingPrograms.length} programmes de soutien · vérifiés le 22 juillet 2026`,
    baseKicker: "Point zéro de la règle",
    baseHeading: "Où résidez-vous actuellement?",
    baseNote: "La ville et la province changent les programmes visibles; la nationalité est vérifiée séparément.",
    regions: { quebec: "Québec", ontario: "Ontario" },
    residences: {
      montreal: "Île de Montréal",
      quebec_city: "Ville de Québec",
      quebec: "Ailleurs au Québec",
      gatineau: "Gatineau",
      toronto: "Ville de Toronto",
      gta: "RGT hors Toronto",
      ottawa: "Ville d’Ottawa",
    },
    steps: ["Votre situation", "Une occasion concrète", "Le financement possible"],
    profileHeading: "Votre situation",
    profile: "Vous déposez comme…",
    discipline: "Votre discipline",
    profiles: { artist: "Artiste individuel·le", collective: "Collectif non incorporé", organization: "Organisme / compagnie" },
    disciplines: { all: "Toutes", circus: "Cirque / jonglerie", theatre: "Théâtre", dance: "Danse", music: "Musique", media: "Arts médiatiques / éducation artistique" },
    legalStatusArtist: "Votre statut au Canada",
    legalStatusCollective: "Statut de la personne responsable",
    legalStatuses: {
      unsure: "Je ne sais pas / à vérifier",
      citizen: "Citoyenneté canadienne",
      permanent: "Résidence permanente",
      protected: "Personne protégée",
      permanent_pending: "Demande de résidence permanente en cours",
      temporary_work: "Statut temporaire avec autorisation de travail valide",
      temporary_no_work: "Statut temporaire sans autorisation de travail",
    },
    provinceHistory: { quebec: "Vous / les membres admissibles résidez au Québec depuis 12 mois", ontario: "Vous / les membres admissibles résidez en Ontario depuis 12 mois" },
    provinceHistories: { unsure: "Je ne sais pas / à vérifier", twelve_plus: "Oui, 12 mois ou plus", under_twelve: "Non, moins de 12 mois" },
    torontoHistory: "Résidence dans la ville de Toronto pendant au moins un an",
    torontoHistories: { unsure: "Je ne sais pas / à vérifier", meets: "Oui", does_not: "Non" },
    sinStatus: "Avez-vous un numéro d’assurance sociale (NAS) valide?",
    yesNoUnsure: { unsure: "Je ne sais pas / à vérifier", yes: "Oui", no: "Non" },
    canadaArrival: "Date d’arrivée au Canada",
    canadaArrivals: { unsure: "Je ne sais pas / à vérifier", after_2019: "Le 1er janvier 2019 ou après", before_2019: "Avant le 1er janvier 2019" },
    ageBand: "Votre tranche d’âge",
    ageBands: { unsure: "Je préfère vérifier", under_18: "Moins de 18 ans", eighteen_thirty: "18 à 30 ans", over_thirty: "Plus de 30 ans" },
    collectiveSize: "Taille du collectif",
    collectiveSizes: { unsure: "Je ne sais pas / à vérifier", two: "2 membres principaux", three_plus: "3 membres principaux ou plus" },
    collectiveComposition: "Part des membres qui satisfont le statut et la résidence demandés",
    collectiveCompositions: {
      unsure: "Je ne sais pas / à vérifier",
      all: "Tous les membres principaux",
      two_thirds: "Au moins les deux tiers",
      majority_qualified: "Plus de la moitié",
      half_qualified: "Exactement la moitié",
      under_half: "Moins de la moitié",
    },
    collectiveCompositionNote: "Pour le Conseil des arts du Canada, les deux membres d’un duo doivent être admissibles.",
    organizationRegistration: "Statut juridique de l’organisme",
    organizationRegistrations: { unsure: "Je ne sais pas / à vérifier", yes: "Constitué ou enregistré au Canada", no: "Non constitué ou non enregistré au Canada" },
    profileNote: "La présélection est volontairement prudente. Une réponse inconnue produit « à confirmer », jamais une admissibilité positive.",
    callsHeading: "Appels pertinents",
    callsCount: "résultats",
    showMoreCalls: (count: number, remaining: number) => `Voir ${count} pistes de plus · ${remaining} restantes`,
    showMoreFunding: (count: number, remaining: number) => `Voir ${count} aides de plus · ${remaining} restantes`,
    radar: {
      kicker: "Radar international",
      heading: "Festivals et marchés à suivre, sans mélanger les appels fermés aux accès actifs.",
      intro: "Un registre de sources officielles pour le cirque, les arts de la rue, les fringes, le cinéma et les marchés professionnels. Chaque ligne indique si la voie est active, attendue ou à surveiller.",
      count: "pistes officielles",
      regions: "régions",
      all: "Tous",
      familyFilter: "Discipline / réseau",
      formatFilter: "Type d’occasion",
      families: { circus: "Cirque", street: "Arts de la rue", fringe: "Fringe", film: "Cinéma", showcase: "Vitrines / marchés" },
      searchTags: {
        regional_festival: "Appels de festivals régionaux",
        event_performance: "Prestations événementielles",
        choreographer_development: "Développement chorégraphique",
        residency: "Résidences / création sur place",
      },
      searchTagDescriptions: {
        regional_festival: "Trouver des appels de festivals et de scènes régionales",
        event_performance: "Trouver des inscriptions et sélections pour se produire",
        choreographer_development: "Trouver des programmes destinés aux chorégraphes",
        residency: "Trouver des résidences et des périodes de création sur place",
      },
      noTagResults: "Aucune piste vérifiée ne porte encore cette étiquette. Le filtre est prêt pour les prochains ajouts.",
      participation: { international: "Candidature internationale", open_access: "Accès libre", selection: "Sélection sur dossier", regional_conditions: "Conditions locales à vérifier", language_conditions: "Conditions linguistiques à vérifier", eligibility_check: "Admissibilité à confirmer" },
      status: { open: "Ouvert", upcoming: "À venir", watch: "À surveiller" },
      official: "Voir la source officielle ↗",
      network: "Voir aussi la fiche du réseau CAFF ↗",
      nextCheck: "Prochaine vérification",
      verified: "Vérifié le",
      note: "Le registre n’affirme jamais qu’un appel est ouvert au-delà de la date vérifiée. Ouvrez la source avant de préparer un dossier.",
      candidateSource: "Route active du radar",
      candidateChosen: "Route sélectionnée dans le radar",
      fundingCheck: "Aide à vérifier séparément",
      fundingCheckNote: "Cette route est active ou annoncée, mais ses conditions et ses dépenses ne sont pas assez structurées pour relier une aide automatiquement. Vérifiez l’appel officiel, puis le programme de financement.",
      fundingReviewHeading: "Revue du financement",
      fundingReviewStatus: {
        suggested: "Pistes fondées sur les critères officiels",
        reviewed_no_match: "Vérifié : aucun lien prudent pour l’instant",
        pending_terms: "En attente de modalités suffisantes",
      },
      fundingSuggested: "Aides à envisager sous conditions",
      fundingSuggestedForProfile: "Aucune piste de cette revue ne correspond au profil et au lieu de résidence sélectionnés.",
      fundingReviewed: "Revue vérifiée le",
      fundingLinked: "Financement relié dans la fiche détaillée",
    },
    noResults: "Aucun appel de l’échantillon ne correspond à ce profil. Essayez une autre discipline.",
    fundingHeading: "Plan de financement",
    chosen: "Occasion choisie",
    officialCall: "Voir l’appel officiel ↗",
    fundingFor: "Aides directement associées",
    noFunding: "Aucune aide n’est reliée directement à cet appel. Les programmes de votre base restent visibles ci-dessous, sans créer de faux match.",
    regionalHeading: "Autres programmes de votre base",
    regionalNote: "Ce programme correspond à votre base et à votre profil, mais n’est pas encore relié à cet appel précis. Vérifiez l’objet du financement avant de l’inclure au budget.",
    officialFunding: "Vérifier le programme officiel ↗",
    eligibilityHeading: "Contrôle d’admissibilité",
    eligibilitySource: "Vérifier les critères officiels ↗",
    eligibilityReasons: {
      statusUnknown: "Le statut au Canada doit être confirmé.",
      statusNotAccepted: "Le statut sélectionné n’est pas accepté par ce programme.",
      statusConditional: "Ce statut peut être considéré, sous réserve d’une autorisation valide et de la capacité du programme.",
      statusVerification: "La page officielle ne tranche pas ce statut; contactez le programme.",
      provinceHistoryUnknown: "La durée de résidence dans la province doit être confirmée.",
      provinceHistoryTooShort: "Ce programme exige 12 mois de résidence dans la province.",
      torontoHistoryUnknown: "La durée de résidence dans la ville de Toronto doit être confirmée.",
      torontoHistoryTooShort: "Ce programme exige au moins un an de résidence dans la ville de Toronto.",
      groupUnknown: "La composition du collectif doit être confirmée.",
      groupNotEnough: "Le collectif n’atteint pas le seuil de membres admissibles.",
      groupSizeUnknown: "Le nombre de membres principaux doit être confirmé.",
      organizationUnknown: "La constitution ou l’enregistrement canadien doit être confirmé.",
      organizationNotEligible: "Un organisme constitué ou enregistré au Canada est requis.",
      organizationProgramCheck: "Les conditions ontariennes propres aux organismes doivent être vérifiées dans le guide.",
      sinUnknown: "La possession d’un NAS doit être confirmée.",
      sinMissing: "Un NAS valide est requis pour ce programme.",
      arrivalUnknown: "La date d’arrivée au Canada doit être confirmée.",
      arrivalTooEarly: "La date d’arrivée ne correspond pas à la cohorte de nouveaux arrivants.",
      ageUnknown: "L’âge doit être confirmé.",
      ageOutOfRange: "La tranche d’âge ne correspond pas au programme.",
      professionalPracticeCheck: "Le statut professionnel, la reconnaissance par les pairs et les preuves de revenus doivent être vérifiés.",
    },
    states: { possible: "Critères apparemment satisfaits", conditional: "Possible sous condition", verify: "À confirmer", ineligible: "Non admissible selon ces réponses" },
    purposes: { mobility_export: "Mobilité / diffusion", home_base_creation: "Création locale", career_support: "Parcours / mentorat" },
    kinds: { grant: "Subvention", paid_program: "Programme rémunéré" },
    closed: "Cohorte fermée",
    coverage: { travel: "transport", stay: "séjour", visa: "visa", transport: "équipement", promotion: "promotion", market: "prospection", touring: "tournée", fees: "honoraires", production: "production", research: "recherche", creation: "création", recording: "enregistrement", mentorship: "mentorat", training: "formation" },
    sourceNote: "Présélection seulement. La page officielle, sa date de vérification et les preuves demandées restent visibles avant toute décision.",
    verified: "Information officielle vérifiée le",
    languageLabel: "Langue d’affichage",
    workflowLabel: "Parcours de vérification",
    matcherLabel: "Correspondance entre appels et financement",
    eligibleCostsLabel: "Types de dépenses admissibles",
    whyKicker: "Pourquoi MESURE",
    whyTitle: "Une liste dit ce qui existe. Une mesure dit ce qui manque.",
    whyBody: "Les sites officiels restent la source de vérité. MESURE relie une occasion réelle aux aides accessibles selon le lieu de résidence, le statut, l’historique local et le moment du projet.",
    rulesKicker: "Règles de confiance",
    rulesTitle: "Pas de “match parfait” inventé.",
    rules: ["Le lieu de résidence et le statut d’immigration sont deux questions distinctes.", "Une omission dans un guide municipal devient « à confirmer », pas une acceptation inventée.", "Chaque règle sensible renvoie vers une source officielle et une date de vérification."],
    footer: "MESURE — Canada · MVP de validation",
    footerNote: "Échantillon limité. Aucun résultat ne garantit l’admissibilité ni l’obtention d’une aide.",
    status: { open: "Ouvert", rolling: "En continu", upcoming: "Bientôt", closed: "Fermé" },
  },
  en: {
    edition: "Canada edition · Québec + Ontario",
    ledgerEdition: "Canada · Monitoring ledger",
    radarLink: "Open the monitoring ledger",
    backToSearch: "Back to opportunity search",
    sourceNotice: {
      label: "About the listings",
      text: "Listings are collected and organized from organizers’ primary sources. Because updates take time, displayed details may differ from the latest information. Always confirm details on each official website.",
    },
    betaNotice: {
      label: "BETA",
      before: "This website is currently in beta. To send a request, comment or correction, please use",
      link: "the feedback form",
      after: ".",
    },
    eyebrow: "From Québec to festivals, stages and residencies worldwide",
    headline: "Find where your art could go next.",
    intro: "Explore verified calls across circus, street arts, Fringe, performance, film, showcases and residencies. Funding appears as the next layer only when a connection can be supported by official criteria.",
    stamp: `${festivalRadar.length} Canadian + international call routes · ${opportunities.length} calls with funding reviewed · ${fundingPrograms.length} support programs · checked July 22, 2026`,
    baseKicker: "Zero point on the ruler",
    baseHeading: "Where do you currently live?",
    baseNote: "City and province change the programs shown; nationality is checked separately.",
    regions: { quebec: "Québec", ontario: "Ontario" },
    residences: { montreal: "Island of Montréal", quebec_city: "City of Québec", quebec: "Elsewhere in Québec", gatineau: "Gatineau", toronto: "City of Toronto", gta: "GTA outside Toronto", ottawa: "City of Ottawa" },
    steps: ["Your situation", "A concrete opportunity", "Possible funding"],
    profileHeading: "Your situation",
    profile: "You are applying as…",
    discipline: "Your discipline",
    profiles: { artist: "Individual artist", collective: "Unincorporated collective", organization: "Organization / company" },
    disciplines: { all: "All", circus: "Circus / juggling", theatre: "Theatre", dance: "Dance", music: "Music", media: "Media arts / arts education" },
    legalStatusArtist: "Your status in Canada",
    legalStatusCollective: "Status of the application representative",
    legalStatuses: { unsure: "Not sure / needs checking", citizen: "Canadian citizen", permanent: "Permanent resident", protected: "Protected Person", permanent_pending: "Permanent residence application pending", temporary_work: "Temporary status with valid work authorization", temporary_no_work: "Temporary status without work authorization" },
    provinceHistory: { quebec: "You / qualifying members have lived in Québec for 12 months", ontario: "You / qualifying members have lived in Ontario for 12 months" },
    provinceHistories: { unsure: "Not sure / needs checking", twelve_plus: "Yes, 12 months or more", under_twelve: "No, less than 12 months" },
    torontoHistory: "At least one year living in the City of Toronto",
    torontoHistories: { unsure: "Not sure / needs checking", meets: "Yes", does_not: "No" },
    sinStatus: "Do you have a valid Social Insurance Number (SIN)?",
    yesNoUnsure: { unsure: "Not sure / needs checking", yes: "Yes", no: "No" },
    canadaArrival: "When did you arrive in Canada?",
    canadaArrivals: { unsure: "Not sure / needs checking", after_2019: "January 1, 2019 or later", before_2019: "Before January 1, 2019" },
    ageBand: "Your age range",
    ageBands: { unsure: "Prefer to check", under_18: "Under 18", eighteen_thirty: "18–30", over_thirty: "Over 30" },
    collectiveSize: "Collective size",
    collectiveSizes: { unsure: "Not sure / needs checking", two: "2 core members", three_plus: "3 or more core members" },
    collectiveComposition: "Share of members meeting the relevant status and residence rules",
    collectiveCompositions: { unsure: "Not sure / needs checking", all: "All core members", two_thirds: "At least two thirds", majority_qualified: "More than half", half_qualified: "Exactly half", under_half: "Fewer than half" },
    collectiveCompositionNote: "For Canada Council, both members of a duo must qualify.",
    organizationRegistration: "Organization’s legal status",
    organizationRegistrations: { unsure: "Not sure / needs checking", yes: "Incorporated or registered in Canada", no: "Not incorporated or registered in Canada" },
    profileNote: "The pre-screen is deliberately conservative. An unknown answer becomes “needs confirmation,” never a positive eligibility result.",
    callsHeading: "Relevant calls",
    callsCount: "results",
    showMoreCalls: (count: number, remaining: number) => `Show ${count} more · ${remaining} remaining`,
    showMoreFunding: (count: number, remaining: number) => `Show ${count} more funding programs · ${remaining} remaining`,
    radar: {
      kicker: "International radar",
      heading: "Festivals and markets to follow—without mixing closed cycles into live access.",
      intro: "An official-source register for circus, street arts, Fringe, film and professional markets. Each line says whether the route is live, about to open or worth watching.",
      count: "official routes",
      regions: "regions",
      all: "All",
      familyFilter: "Discipline / network",
      formatFilter: "Opportunity type",
      families: { circus: "Circus", street: "Street arts", fringe: "Fringe", film: "Film", showcase: "Showcases / markets" },
      searchTags: {
        regional_festival: "Regional festival calls",
        event_performance: "Event performances",
        choreographer_development: "Choreographer development",
        residency: "AIR / residencies",
      },
      searchTagDescriptions: {
        regional_festival: "Find festival and regional performance calls",
        event_performance: "Find event performance registrations and selections",
        choreographer_development: "Find development programs for choreographers",
        residency: "Find artist-in-residence and on-site creation opportunities",
      },
      noTagResults: "No verified route carries this tag yet. The filter is ready for future additions.",
      participation: { international: "International applications", open_access: "Open access", selection: "Curated selection", regional_conditions: "Local conditions to check", language_conditions: "Language conditions to check", eligibility_check: "Eligibility to confirm" },
      status: { open: "Open", upcoming: "Opening soon", watch: "Watch next cycle" },
      official: "Open official source ↗",
      network: "Also open the CAFF network record ↗",
      nextCheck: "Next check",
      verified: "Verified",
      note: "This register never treats an old deadline as live. Open the official source before preparing a submission.",
      candidateSource: "Active route from the radar",
      candidateChosen: "Selected radar route",
      fundingCheck: "Funding requires a separate check",
      fundingCheckNote: "This route is open or announced, but its conditions and expenses are not structured enough to link funding automatically. Check the official call first, then the funding program.",
      fundingReviewHeading: "Funding review",
      fundingReviewStatus: {
        suggested: "Evidence-based funding leads",
        reviewed_no_match: "Reviewed: no prudent link yet",
        pending_terms: "Waiting for sufficient terms",
      },
      fundingSuggested: "Programs to consider under conditions",
      fundingSuggestedForProfile: "None of the reviewed leads fits the selected profile and place of residence.",
      fundingReviewed: "Funding review verified",
      fundingLinked: "Funding linked in the detailed call",
    },
    noResults: "No call in this sample matches the profile. Try another discipline.",
    fundingHeading: "Funding plan",
    chosen: "Selected opportunity",
    officialCall: "Open official call ↗",
    fundingFor: "Programs linked directly",
    noFunding: "No program is directly linked to this call. Home-base programs remain visible below without creating a false match.",
    regionalHeading: "Other programs from your home base",
    regionalNote: "This program fits your home base and profile but is not yet linked to this specific call. Check its funding purpose before adding it to the budget.",
    officialFunding: "Check official program ↗",
    eligibilityHeading: "Eligibility checkpoint",
    eligibilitySource: "Check official eligibility rules ↗",
    eligibilityReasons: {
      statusUnknown: "Status in Canada still needs confirmation.", statusNotAccepted: "The selected status is not accepted by this program.", statusConditional: "This status may be considered, subject to valid authorization and program capacity.", statusVerification: "The official page does not resolve this status; contact the program.", provinceHistoryUnknown: "Length of residence in the province still needs confirmation.", provinceHistoryTooShort: "This program requires 12 months of residence in the province.", torontoHistoryUnknown: "Length of residence in the City of Toronto still needs confirmation.", torontoHistoryTooShort: "This program requires at least one year in the City of Toronto.", groupUnknown: "The collective’s composition still needs confirmation.", groupNotEnough: "The collective does not meet the qualifying-member threshold.", groupSizeUnknown: "The number of core members still needs confirmation.", organizationUnknown: "Canadian incorporation or registration still needs confirmation.", organizationNotEligible: "A Canadian-incorporated or registered organization is required.", organizationProgramCheck: "Ontario-specific organization conditions must be checked in the guide.", sinUnknown: "SIN status still needs confirmation.", sinMissing: "A valid SIN is required for this program.", arrivalUnknown: "Arrival date in Canada still needs confirmation.", arrivalTooEarly: "The arrival date does not fit this newcomer cohort.", ageUnknown: "Age still needs confirmation.", ageOutOfRange: "The selected age range does not fit the program.", professionalPracticeCheck: "Professional standing, peer recognition and income evidence still need checking."
    },
    states: { possible: "Published criteria appear met", conditional: "Possible with conditions", verify: "Needs confirmation", ineligible: "Not eligible from these answers" },
    purposes: { mobility_export: "Mobility / export", home_base_creation: "Local creation", career_support: "Career / mentorship" },
    kinds: { grant: "Grant", paid_program: "Paid program" },
    closed: "Cohort closed",
    coverage: { travel: "travel", stay: "stay", visa: "visa", transport: "equipment", promotion: "promotion", market: "market access", touring: "touring", fees: "fees", production: "production", research: "research", creation: "creation", recording: "recording", mentorship: "mentorship", training: "training" },
    sourceNote: "Pre-screen only. The official page, verification date and required proof remain visible before any decision.",
    verified: "Official information checked",
    languageLabel: "Display language",
    workflowLabel: "Matching workflow",
    matcherLabel: "Opportunity and funding matcher",
    eligibleCostsLabel: "Eligible cost types",
    whyKicker: "Why MESURE",
    whyTitle: "A list tells you what exists. A measure tells you what is missing.",
    whyBody: "Official websites remain the source of truth. MESURE connects a real opportunity with programs based on residence, status, local history and timing.",
    rulesKicker: "Trust rules",
    rulesTitle: "No invented “perfect match.”",
    rules: ["Residence and immigration status are separate questions.", "An omission in municipal guidelines becomes “needs confirmation,” not an invented approval.", "Every sensitive rule links to an official source and verification date."],
    footer: "MESURE — Canada · Validation MVP",
    footerNote: "Limited sample. No result guarantees eligibility or funding.",
    status: { open: "Open", rolling: "Rolling", upcoming: "Upcoming", closed: "Closed" },
  },
  ja: {
    edition: "カナダ版 · ケベック州＋オンタリオ州",
    ledgerEdition: "カナダ版 · 監視台帳",
    radarLink: "監視台帳を見る",
    backToSearch: "公募検索へ戻る",
    sourceNotice: {
      label: "掲載情報について",
      text: "掲載情報は、主催者等の一次情報をもとに収集・整理しています。更新のタイミングにより、最新の情報と異なる場合があります。詳細・最新情報は、必ず各公式サイトでご確認ください。",
    },
    betaNotice: {
      label: "BETA",
      before: "このウェブサイトは現在ベータ版です。ご要望・ご意見、掲載情報の訂正などがありましたら、",
      link: "フォーム",
      after: "よりご連絡いただけると幸いです。",
    },
    eyebrow: "ケベックから、世界のフェスティバル・出演公募・滞在制作へ",
    headline: "次に作品を持っていける場所を、見つける。",
    intro: "サーカス、大道芸、フリンジ、舞台、映画、ショーケース、滞在制作の公募を、公式情報をもとに横断して探せます。助成制度は、応募先との対応を確認できた場合に限って、次の手段として表示します。",
    stamp: `${festivalRadar.length}件の国内外公募・監視ルート · ${opportunities.length}件の助成照合済み公募 · ${fundingPrograms.length}件の支援制度 · 2026年7月22日確認`,
    baseKicker: "物差しのゼロ地点",
    baseHeading: "現在どこに住んでいますか？",
    baseNote: "市と州で表示制度が変わります。国籍・在留資格は次の質問で別に確認します。",
    regions: { quebec: "ケベック州", ontario: "オンタリオ州" },
    residences: { montreal: "モントリオール島内", quebec_city: "ケベック・シティ", quebec: "ケベック州内（その他）", gatineau: "ガティノー", toronto: "トロント市", gta: "GTA（トロント市外）", ottawa: "オタワ市" },
    steps: ["申請者の状況", "具体的な公募", "利用可能性のある制度"],
    profileHeading: "申請者の状況",
    profile: "申請主体",
    discipline: "活動分野",
    profiles: { artist: "個人アーティスト", collective: "法人格のないコレクティブ", organization: "団体・カンパニー" },
    disciplines: { all: "すべて", circus: "サーカス・ジャグリング", theatre: "演劇", dance: "ダンス", music: "音楽", media: "メディア芸術・芸術教育" },
    legalStatusArtist: "カナダでの在留資格",
    legalStatusCollective: "申請代表者の在留資格",
    legalStatuses: { unsure: "不明・要確認", citizen: "カナダ市民", permanent: "永住者", protected: "Protected Person（保護対象者）", permanent_pending: "永住権を申請中", temporary_work: "有効な就労許可がある一時滞在", temporary_no_work: "就労許可がない一時滞在" },
    provinceHistory: { quebec: "本人／対象メンバーのケベック州居住が12か月以上", ontario: "本人／対象メンバーのオンタリオ州居住が12か月以上" },
    provinceHistories: { unsure: "不明・要確認", twelve_plus: "12か月以上", under_twelve: "12か月未満" },
    torontoHistory: "トロント市内での居住が1年以上",
    torontoHistories: { unsure: "不明・要確認", meets: "はい", does_not: "いいえ" },
    sinStatus: "有効なSIN（社会保険番号）を持っていますか？",
    yesNoUnsure: { unsure: "不明・要確認", yes: "はい", no: "いいえ" },
    canadaArrival: "カナダへの到着時期",
    canadaArrivals: { unsure: "不明・要確認", after_2019: "2019年1月1日以降", before_2019: "2019年1月1日より前" },
    ageBand: "年齢区分",
    ageBands: { unsure: "不明・要確認", under_18: "18歳未満", eighteen_thirty: "18〜30歳", over_thirty: "31歳以上" },
    collectiveSize: "コレクティブの主要メンバー数",
    collectiveSizes: { unsure: "不明・要確認", two: "2人", three_plus: "3人以上" },
    collectiveComposition: "制度の在留資格・居住条件を満たす主要メンバーの割合",
    collectiveCompositions: { unsure: "不明・要確認", all: "全員", two_thirds: "3分の2以上", majority_qualified: "半数を超える", half_qualified: "ちょうど半数", under_half: "半数未満" },
    collectiveCompositionNote: "Canada Councilでは、2人組の場合は2人とも対象資格を満たす必要があります。",
    organizationRegistration: "団体の法的登録状況",
    organizationRegistrations: { unsure: "不明・要確認", yes: "カナダで法人化・登録済み", no: "カナダで法人化・登録されていない" },
    profileNote: "判定は意図的に慎重です。不明な回答は「利用可能」とせず、必ず「要確認」にします。",
    callsHeading: "該当する公募",
    callsCount: "件",
    showMoreCalls: (count: number, remaining: number) => `続きを${count}件見る（残り${remaining}件）`,
    showMoreFunding: (count: number, remaining: number) => `助成・支援制度をさらに${count}件見る（残り${remaining}件）`,
    radar: {
      kicker: "国際公募・ショーケース レーダー",
      heading: "終了した募集を「募集中」に見せず、フェスと市場の次の入口を追えるようにする。",
      intro: "サーカス、大道芸、フリンジ、映画、プロ向けショーケースを対象に、公式情報だけを記録した監視台帳です。各行は、募集中・開始予定・次回監視のどれかを示します。",
      count: "件の公式ルート",
      regions: "地域",
      all: "すべて",
      familyFilter: "分野・ネットワーク",
      formatFilter: "募集形式タグ",
      families: { circus: "サーカス", street: "大道芸・公共空間", fringe: "フリンジ", film: "映画", showcase: "ショーケース・市場" },
      searchTags: {
        regional_festival: "地域フェスティバル・出演者公募",
        event_performance: "イベント出演",
        choreographer_development: "振付家育成プログラム",
        residency: "AIR・滞在制作",
      },
      searchTagDescriptions: {
        regional_festival: "地域のフェスティバルや舞台への出演公募を探す",
        event_performance: "イベント出演の登録・選考ルートを探す",
        choreographer_development: "振付家や振付作品の育成プログラムを探す",
        residency: "アーティスト・イン・レジデンスや滞在制作を探す",
      },
      noTagResults: "現在の確認済みデータには、このタグに該当する公募がありません。今後の追加に備えて検索条件を用意しています。",
      participation: { international: "国際応募可", open_access: "オープンアクセス", selection: "選考型", regional_conditions: "地域条件を要確認", language_conditions: "言語条件を要確認", eligibility_check: "応募資格を要確認" },
      status: { open: "募集中", upcoming: "開始予定", watch: "次回を監視" },
      official: "公式情報を開く ↗",
      network: "CAFFネットワーク情報も開く ↗",
      nextCheck: "次回確認日",
      verified: "公式情報の確認日",
      note: "古い締切を「募集中」とは扱いません。応募準備の前に必ず公式情報を開いてください。",
      candidateSource: "監視台帳の現在の案件",
      candidateChosen: "監視台帳から選択した案件",
      fundingCheck: "助成金は個別確認",
      fundingCheckNote: "このルートは募集中または開始予定ですが、活動内容・費目の情報が助成金を自動照合できるほど構造化されていません。まず公式要項を確認し、その後に助成制度を個別に確認してください。",
      fundingReviewHeading: "助成金の照合結果",
      fundingReviewStatus: {
        suggested: "公式条件に基づく候補あり",
        reviewed_no_match: "確認済み：現時点で安全な直結なし",
        pending_terms: "要項不足のため保留",
      },
      fundingSuggested: "条件付きで検討できる助成制度",
      fundingSuggestedForProfile: "今回確認した候補には、選択中の申請者区分・居住地に合う制度がありません。",
      fundingReviewed: "助成金照合日",
      fundingLinked: "詳細公募で助成金を連動済み",
    },
    noResults: "このサンプル内に条件と一致する公募がありません。別の活動分野を選んでください。",
    fundingHeading: "資金計画",
    chosen: "選択中の公募",
    officialCall: "公募の公式情報を確認 ↗",
    fundingFor: "この公募に直接関連する制度",
    noFunding: "この公募へ直接結びつけた制度はありません。誤った対応関係を作らず、居住地で使えるその他の制度を下に分けて表示します。",
    regionalHeading: "居住地から探せるその他の制度",
    regionalNote: "居住地・申請主体には合いますが、この公募との直接対応はまだ確認していません。資金計画へ入れる前に制度の目的を確認してください。",
    officialFunding: "制度の公式情報を確認 ↗",
    eligibilityHeading: "申請資格の確認",
    eligibilitySource: "申請資格の公式条件を確認 ↗",
    eligibilityReasons: {
      statusUnknown: "カナダでの在留資格を確認してください。", statusNotAccepted: "選択した在留資格は、この制度で認められていません。", statusConditional: "有効な許可と受入枠を条件に検討対象となる可能性があります。", statusVerification: "公式ページだけではこの在留資格を判定できません。制度担当へ確認してください。", provinceHistoryUnknown: "州内の居住期間を確認してください。", provinceHistoryTooShort: "この制度は州内で12か月以上の居住を必要とします。", torontoHistoryUnknown: "トロント市内の居住期間を確認してください。", torontoHistoryTooShort: "この制度はトロント市内で1年以上の居住を必要とします。", groupUnknown: "コレクティブの構成を確認してください。", groupNotEnough: "対象条件を満たす主要メンバーの割合が基準に達していません。", groupSizeUnknown: "主要メンバー数を確認してください。", organizationUnknown: "カナダでの法人化・登録状況を確認してください。", organizationNotEligible: "カナダで法人化または登録された団体である必要があります。", organizationProgramCheck: "オンタリオ州の団体固有条件を公式要項で追加確認してください。", sinUnknown: "SINの有無を確認してください。", sinMissing: "この制度には有効なSINが必要です。", arrivalUnknown: "カナダへの到着時期を確認してください。", arrivalTooEarly: "到着時期が新人向けプログラムの対象期間外です。", ageUnknown: "年齢を確認してください。", ageOutOfRange: "選択した年齢区分は制度の対象外です。", professionalPracticeCheck: "プロとしての活動実績、同業者からの評価、収入証明を確認してください。"
    },
    states: { possible: "公表条件には適合", conditional: "条件を満たせば可能性あり", verify: "個別確認が必要", ineligible: "入力条件では対象外" },
    purposes: { mobility_export: "渡航・国外展開", home_base_creation: "居住地での創作", career_support: "キャリア・メンタリング" },
    kinds: { grant: "助成金", paid_program: "有給プログラム" },
    closed: "今回の募集は終了",
    coverage: { travel: "渡航費", stay: "滞在費", visa: "査証費", transport: "機材運搬費", promotion: "広報費", market: "市場開拓費", touring: "ツアー費", fees: "報酬", production: "制作費", research: "調査費", creation: "創作費", recording: "録音費", mentorship: "メンタリング", training: "研修" },
    sourceNote: "これは事前確認用です。申請を決める前に、公式ページ、情報の確認日、必要書類を必ず確認してください。",
    verified: "公式情報の確認日",
    languageLabel: "表示言語",
    workflowLabel: "照合の手順",
    matcherLabel: "公募と助成制度の照合",
    eligibleCostsLabel: "対象となる経費",
    whyKicker: "MESUREの目的",
    whyTitle: "一覧は「何があるか」を示す。物差しは「何が足りないか」を示す。",
    whyBody: "最終的な根拠は各機関の公式サイトです。MESUREは居住地、在留資格、地域での居住歴、申請時期をもとに、実在する公募と制度を結びつけます。",
    rulesKicker: "信頼性のルール",
    rulesTitle: "根拠のない「最適な助成」は表示しません。",
    rules: ["居住地と在留資格を別々の質問として扱います。", "市の要項に記載がない条件は、勝手に利用可とせず「要確認」にします。", "判定に影響する情報には、公式情報へのリンクと確認日を付けます。"],
    footer: "MESURE — Canada · 検証用MVP",
    footerNote: "限定的なサンプルデータです。表示結果は申請資格や採択を保証しません。",
    status: { open: "募集中", rolling: "随時受付", upcoming: "近日開始", closed: "募集終了" },
  },
} as const;

const placeNames: Record<Language, Record<string, string>> = {
  fr: {},
  en: {},
  ja: {
    France: "フランス", Paris: "パリ", Australia: "オーストラリア", Perth: "パース", China: "中国", Wuzhen: "烏鎮", "United States": "アメリカ合衆国", Seattle: "シアトル", "United Kingdom": "イギリス", Leeds: "リーズ", Canada: "カナダ", Montréal: "モントリオール", Ottawa: "オタワ", Québec: "ケベック・シティ", Rimouski: "リムースキ", Netherlands: "オランダ", Rotterdam: "ロッテルダム", Germany: "ドイツ", Berlin: "ベルリン", Portugal: "ポルトガル", "Santa Maria da Feira": "サンタ・マリア・ダ・フェイラ", "South Korea": "韓国", Seoul: "ソウル", Edinburgh: "エディンバラ", Adelaide: "アデレード", Toronto: "トロント", Amsterdam: "アムステルダム", Singapore: "シンガポール", Japan: "日本", Yokohama: "横浜", Boulder: "ボルダー", Switzerland: "スイス", Geneva: "ジュネーブ", Egypt: "エジプト", Cairo: "カイロ", Mexico: "メキシコ", Guadalajara: "グアダラハラ", Brooklyn: "ブルックリン", Aurillac: "オーリヤック", Spain: "スペイン", Seville: "セビリア", "Tàrrega": "タラガ", Auch: "オーシュ", Croatia: "クロアチア", "Poreč": "ポレッチ", "South Africa": "南アフリカ", "Cape Town": "ケープタウン", "Canada-wide": "カナダ各地", "Nordic region": "北欧", "Nordic circuit": "北欧巡回", Calgary: "カルガリー", Whitehorse: "ホワイトホース", Brighton: "ブライトン", Orlando: "オーランド", "Salaberry-de-Valleyfield": "サラベリー＝ド＝バレーフィールド",
  },
};

const profileOptions: Profile[] = ["artist", "collective", "organization"];
const residenceGroups: Record<"quebec" | "ontario", Residence[]> = {
  quebec: ["montreal", "quebec_city", "quebec", "gatineau"],
  ontario: ["toronto", "gta", "ottawa"],
};
const disciplineOptions: Discipline[] = ["all", "circus", "theatre", "dance", "music", "media"];
const radarFamilyOptions: RadarFamily[] = ["all", "circus", "street", "fringe", "film", "showcase"];
const radarSearchTagOptions: RadarSearchTag[] = ["all", "regional_festival", "event_performance", "choreographer_development", "residency"];
const radarFamilyDisciplines: Record<Exclude<RadarFamily, "all">, Exclude<Discipline, "all">[]> = {
  circus: ["circus"],
  street: ["circus", "theatre", "dance", "music"],
  fringe: ["circus", "theatre", "dance", "music"],
  film: ["media"],
  showcase: ["circus", "theatre", "dance", "music", "media"],
};
const legalStatusOptions: LegalStatus[] = ["unsure", "citizen", "permanent", "protected", "permanent_pending", "temporary_work", "temporary_no_work"];
const provinceHistoryOptions: ProvinceHistory[] = ["unsure", "twelve_plus", "under_twelve"];
const torontoHistoryOptions: TorontoHistory[] = ["unsure", "meets", "does_not"];
const collectiveCompositionOptions: CollectiveComposition[] = ["unsure", "all", "two_thirds", "majority_qualified", "half_qualified", "under_half"];
const collectiveSizeOptions: CollectiveSize[] = ["unsure", "two", "three_plus"];
const organizationRegistrationOptions: OrganizationRegistration[] = ["unsure", "yes", "no"];
const yesNoUnsureOptions: YesNoUnsure[] = ["unsure", "yes", "no"];
const canadaArrivalOptions: CanadaArrival[] = ["unsure", "after_2019", "before_2019"];
const ageBandOptions: AgeBand[] = ["unsure", "under_18", "eighteen_thirty", "over_thirty"];
const stateOrder: Record<MatchState, number> = { possible: 0, conditional: 1, verify: 2, ineligible: 3 };

function normalizedStatus(opportunity: Opportunity) {
  const now = new Date();
  const openDate = opportunity.openDate ? new Date(`${opportunity.openDate}T00:00:00`) : null;
  if (openDate && now < openDate) return "upcoming" as const;
  if (opportunity.deadlineDate) {
    const deadline = new Date(`${opportunity.deadlineDate}T23:59:59`);
    if (now > deadline) return "closed" as const;
  }
  return opportunity.status;
}

function isUrgentDeadline(deadlineDate: string | null) {
  if (!deadlineDate) return false;
  const remainingDays = (new Date(`${deadlineDate}T23:59:59`).getTime() - Date.now()) / 86_400_000;
  return remainingDays >= 0 && remainingDays <= 21;
}

function isUrgent(opportunity: Opportunity) {
  return isUrgentDeadline(opportunity.deadlineDate);
}

function normalizedRadarStatus(record: FestivalRadar) {
  if (record.status === "open" && record.deadlineDate) {
    const deadline = new Date(`${record.deadlineDate}T23:59:59`);
    if (Date.now() > deadline.getTime()) return "watch" as const;
  }
  return record.status;
}

const radarStatusOrder: Record<RadarStatus, number> = { open: 0, upcoming: 1, watch: 2 };
const candidateStatusOrder: Record<CandidateStatus, number> = { open: 0, rolling: 0, upcoming: 1 };

function radarMatchesDiscipline(record: FestivalRadar, discipline: Discipline) {
  return discipline === "all" || radarFamilyDisciplines[record.family].includes(discipline);
}

// Search tags are derived only from existing titles and families. They never infer eligibility.
const radarSearchTagMatchers: Record<RadarSearchTagKey, (record: FestivalRadar) => boolean> = {
  regional_festival: (record) =>
    ["circus", "street", "fringe"].includes(record.family)
    && /festival|fringe|fira|imaginarius|circada|aurillac/i.test(record.title),
  event_performance: (record) =>
    ["circus", "street", "fringe", "showcase"].includes(record.family)
    && !/residen|résiden/i.test(record.title)
    && /artist|performance|showcase|pitch|programme|program|compagn|vitrine|tour de piste|circulation|selection|registration|lottery|open call|appel|prix|market|biennale|rencontre/i.test(record.title),
  choreographer_development: (record) => /choreograph|chorégraphe|振付/i.test(record.title),
  residency: (record) => /residen|résiden|滞在制作/i.test(record.title),
};

function radarSearchTagsOf(record: FestivalRadar) {
  return (Object.keys(radarSearchTagMatchers) as RadarSearchTagKey[])
    .filter((tag) => radarSearchTagMatchers[tag](record));
}

export function OpportunityWorkbench() {
  const [language, setLanguage] = useState<Language>("fr");
  const [profile, setProfile] = useState<Profile>("artist");
  const [residence, setResidence] = useState<Residence>("montreal");
  const [discipline, setDiscipline] = useState<Discipline>("all");
  const [legalStatus, setLegalStatus] = useState<LegalStatus>("unsure");
  const [provinceHistory, setProvinceHistory] = useState<ProvinceHistory>("unsure");
  const [torontoHistory, setTorontoHistory] = useState<TorontoHistory>("unsure");
  const [collectiveComposition, setCollectiveComposition] = useState<CollectiveComposition>("unsure");
  const [collectiveSize, setCollectiveSize] = useState<CollectiveSize>("unsure");
  const [organizationRegistration, setOrganizationRegistration] = useState<OrganizationRegistration>("unsure");
  const [sinStatus, setSinStatus] = useState<YesNoUnsure>("unsure");
  const [canadaArrival, setCanadaArrival] = useState<CanadaArrival>("unsure");
  const [ageBand, setAgeBand] = useState<AgeBand>("unsure");
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => opportunities[0] ? `call:${opportunities[0].id}` : "");
  const [visibleCandidateCount, setVisibleCandidateCount] = useState(candidatePageSize);
  const [fundingPagination, setFundingPagination] = useState<{
    contextKey: string;
    counts: Partial<Record<FundingSection, number>>;
  } | null>(null);
  const t = copy[language];
  const provinceKey = (["montreal", "quebec_city", "quebec", "gatineau"] as Residence[]).includes(residence) ? "quebec" : "ontario";
  const showTorontoQuestions = profile === "artist" && (residence === "toronto" || residence === "gta");
  const showAgeQuestion = profile === "artist" && ["toronto", "gta", "ottawa"].includes(residence);

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr-CA" : language === "en" ? "en-CA" : "ja";
  }, [language]);

  const filteredOpportunities = useMemo(
    () => opportunities
      .filter((opportunity) => opportunity.profiles.includes(profile))
      .filter((opportunity) => discipline === "all" || opportunity.disciplines.includes(discipline as Exclude<Discipline, "all">))
      .filter((opportunity) => normalizedStatus(opportunity) !== "closed")
      .sort((a, b) => {
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return a.deadlineDate.localeCompare(b.deadlineDate);
      }),
    [discipline, profile],
  );

  const activeRadarCandidates = useMemo(
    () => festivalRadar
      .map((radar) => ({ radar, status: normalizedRadarStatus(radar) }))
      .filter(({ status }) => status !== "watch")
      .filter(({ radar }) => !radar.linkedOpportunityId)
      .filter(({ radar }) => radarMatchesDiscipline(radar, discipline))
      .map(({ radar, status }) => ({
        candidateId: `radar:${radar.id}`,
        source: "radar" as const,
        status: status as Exclude<RadarStatus, "watch">,
        radar,
      })),
    [discipline],
  );

  const candidateRoutes = useMemo(
    () => [
      ...filteredOpportunities.map((opportunity) => ({
        candidateId: `call:${opportunity.id}`,
        source: "call" as const,
        status: normalizedStatus(opportunity) as CandidateStatus,
        opportunity,
      })),
      ...activeRadarCandidates,
    ].sort((left, right) => {
      const statusDifference = candidateStatusOrder[left.status] - candidateStatusOrder[right.status];
      if (statusDifference) return statusDifference;
      const leftDeadline = left.source === "call" ? left.opportunity.deadlineDate : left.radar.deadlineDate;
      const rightDeadline = right.source === "call" ? right.opportunity.deadlineDate : right.radar.deadlineDate;
      if (!leftDeadline && !rightDeadline) {
        const leftTitle = left.source === "call" ? left.opportunity.title : left.radar.title;
        const rightTitle = right.source === "call" ? right.opportunity.title : right.radar.title;
        return leftTitle.localeCompare(rightTitle);
      }
      if (!leftDeadline) return 1;
      if (!rightDeadline) return -1;
      return leftDeadline.localeCompare(rightDeadline);
    }) as CandidateRoute[],
    [activeRadarCandidates, filteredOpportunities],
  );

  const selectedCandidate = candidateRoutes.find((candidate) => candidate.candidateId === selectedCandidateId) ?? candidateRoutes[0];
  const selectedOpportunity = selectedCandidate?.source === "call" ? selectedCandidate.opportunity : undefined;
  const visibleCandidateRoutes = candidateRoutes.slice(0, visibleCandidateCount);
  const remainingCandidateCount = Math.max(0, candidateRoutes.length - visibleCandidateRoutes.length);
  const nextCandidateBatchSize = Math.min(candidatePageSize, remainingCandidateCount);

  const answers = useMemo(() => ({
    profile, legalStatus, provinceHistory, torontoHistory, collectiveComposition, collectiveSize,
    organizationRegistration, sinStatus, canadaArrival, ageBand,
  }), [ageBand, canadaArrival, collectiveComposition, collectiveSize, legalStatus, organizationRegistration, profile, provinceHistory, sinStatus, torontoHistory]);

  const matches = useMemo(() => {
    if (!selectedOpportunity) return [];
    return selectedOpportunity.fundingMatches.flatMap((match) => {
      const funding = fundingPrograms.find((program) => program.id === match.fundingId);
      if (!funding) return [];
      const disciplineOk = funding.disciplines.includes("all") || selectedOpportunity.disciplines.some((item) => funding.disciplines.includes(item));
      if (!funding.profiles.includes(profile) || !supportsResidence(funding, residence) || !disciplineOk) return [];
      const assessment = evaluateFundingEligibility({ funding, baseState: match.state, ...answers }) as Assessment;
      return [{ funding, match, assessment }];
    });
  }, [answers, profile, residence, selectedOpportunity]);

  const radarMatches = useMemo(() => {
    if (selectedCandidate?.source !== "radar" || selectedCandidate.radar.fundingReview?.status !== "suggested") return [];
    return selectedCandidate.radar.fundingReview.fundingMatches.flatMap((match) => {
      const funding = fundingPrograms.find((program) => program.id === match.fundingId);
      if (!funding) return [];
      const disciplineOk = funding.disciplines.includes("all") || radarFamilyDisciplines[selectedCandidate.radar.family].some((item) => funding.disciplines.includes(item));
      if (!funding.profiles.includes(profile) || !supportsResidence(funding, residence) || !disciplineOk) return [];
      const assessment = evaluateFundingEligibility({ funding, baseState: match.state, ...answers }) as Assessment;
      return [{ funding, match, assessment }];
    });
  }, [answers, profile, residence, selectedCandidate]);

  const regionalPrograms = useMemo(() => {
    if (!selectedOpportunity) return [];
    const directIds = new Set(selectedOpportunity?.fundingMatches.map((match) => match.fundingId) ?? []);
    return fundingPrograms
      .filter((funding) => !directIds.has(funding.id))
      .filter((funding) => funding.profiles.includes(profile))
      .filter((funding) => supportsResidence(funding, residence))
      .filter((funding) => discipline === "all" || funding.disciplines.includes("all") || funding.disciplines.includes(discipline))
      .map((funding) => ({ funding, assessment: evaluateFundingEligibility({ funding, baseState: "possible", ...answers }) as Assessment }))
      .sort((a, b) => stateOrder[a.assessment.state] - stateOrder[b.assessment.state] || a.funding.name.localeCompare(b.funding.name));
  }, [answers, discipline, profile, residence, selectedOpportunity]);

  const fundingContextKey = [
    selectedCandidate?.candidateId ?? "none",
    profile,
    residence,
    discipline,
    legalStatus,
    provinceHistory,
    torontoHistory,
    collectiveComposition,
    collectiveSize,
    organizationRegistration,
    sinStatus,
    canadaArrival,
    ageBand,
  ].join("|");
  const visibleFundingCount = (section: FundingSection) => (
    fundingPagination?.contextKey === fundingContextKey
      ? fundingPagination.counts[section] ?? fundingPageSize
      : fundingPageSize
  );
  const revealMoreFunding = (section: FundingSection, total: number) => {
    setFundingPagination((current) => {
      const counts = current?.contextKey === fundingContextKey ? current.counts : {};
      return {
        contextKey: fundingContextKey,
        counts: {
          ...counts,
          [section]: Math.min((counts[section] ?? fundingPageSize) + fundingPageSize, total),
        },
      };
    });
  };
  const visibleMatches = matches.slice(0, visibleFundingCount("direct"));
  const remainingMatchCount = Math.max(0, matches.length - visibleMatches.length);
  const nextMatchBatchSize = Math.min(fundingPageSize, remainingMatchCount);
  const visibleRadarMatches = radarMatches.slice(0, visibleFundingCount("radar"));
  const remainingRadarMatchCount = Math.max(0, radarMatches.length - visibleRadarMatches.length);
  const nextRadarMatchBatchSize = Math.min(fundingPageSize, remainingRadarMatchCount);
  const visibleRegionalPrograms = regionalPrograms.slice(0, visibleFundingCount("regional"));
  const remainingRegionalProgramCount = Math.max(0, regionalPrograms.length - visibleRegionalPrograms.length);
  const nextRegionalProgramBatchSize = Math.min(fundingPageSize, remainingRegionalProgramCount);

  const renderFundingCard = (funding: Funding, assessment: Assessment, note: string, compact = false) => (
    <article className={`funding-match ${assessment.state} ${compact ? "compact" : ""}`} key={funding.id}>
      <div className="funding-flags">
        <span className="match-state">{t.states[assessment.state]}</span>
        <span>{t.kinds[funding.kind]}</span>
        <span>{t.purposes[funding.purpose]}</span>
        {funding.availability === "closed" ? <span className="closed-flag">{t.closed}</span> : null}
      </div>
      <h5>{funding.name}</h5>
      <p className="funder-name">{funding.funder}</p>
      <p>{note}</p>
      <div className="eligibility-check">
        <span className="section-kicker">{t.eligibilityHeading}</span>
        <p>{funding.eligibility.note[language]}</p>
        {assessment.reasonKeys.length ? (
          <ul className="eligibility-reasons">
            {assessment.reasonKeys.map((reason) => <li key={reason}>{t.eligibilityReasons[reason]}</li>)}
          </ul>
        ) : null}
        <a className="eligibility-link" href={funding.eligibility.sourceUrl} target="_blank" rel="noreferrer">{t.eligibilitySource}</a>
        <span className="verified-date">{t.verified}: {funding.eligibility.verifiedAt}</span>
      </div>
      <div className="coverage" aria-label={t.eligibleCostsLabel}>
        {funding.coverage.map((item) => <span key={item}>{t.coverage[item]}</span>)}
      </div>
      <p className="amount-line">{funding.amount[language]}</p>
      <p>{funding.deadline[language]}</p>
      <p>{funding.cashflow[language]}</p>
      <a className="funding-link" href={funding.sourceUrl} target="_blank" rel="noreferrer">{t.officialFunding}</a>
      <span className="verified-date">{t.verified}: {funding.verifiedAt}</span>
    </article>
  );

  return (
    <main className="site-shell">
      <header className="masthead">
        <div className="brandline"><h1 className="brand">MESURE</h1><span className="edition">{t.edition}</span></div>
        <div className="language-switch" aria-label={t.languageLabel}>
          {(["fr", "en", "ja"] as Language[]).map((item) => <button key={item} type="button" aria-pressed={language === item} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}
        </div>
      </header>

      <div className="site-notices">
        <aside className="source-notice" aria-label={t.sourceNotice.label}>
          <strong>{t.sourceNotice.label}</strong>
          <span>{t.sourceNotice.text}</span>
        </aside>
        <aside className="beta-notice" aria-label={t.betaNotice.label}>
          <strong>{t.betaNotice.label}</strong>
          <span>{t.betaNotice.before} <a href={feedbackFormUrl} target="_blank" rel="noreferrer">{t.betaNotice.link}</a>{t.betaNotice.after}</span>
        </aside>
      </div>

      <section className="intro" aria-labelledby="intro-title">
        <div><p className="eyebrow">{t.eyebrow}</p><h2 id="intro-title">{t.headline}</h2></div>
        <div className="intro-copy"><p>{t.intro}</p><span className="data-stamp">{t.stamp}</span></div>
      </section>

      <section className="base-ruler" aria-labelledby="base-heading">
        <div className="base-copy"><span className="section-kicker">{t.baseKicker}</span><h3 id="base-heading">{t.baseHeading}</h3><p>{t.baseNote}</p></div>
        <div className="base-groups">
          {(Object.keys(residenceGroups) as ("quebec" | "ontario")[]).map((region) => (
            <fieldset className="base-group" key={region}>
              <legend>{t.regions[region]}</legend>
              <div>
                {residenceGroups[region].map((item) => <button type="button" key={item} aria-pressed={residence === item} onClick={() => setResidence(item)}><span aria-hidden="true">{residence === item ? "◆" : "◇"}</span>{t.residences[item]}</button>)}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <nav className="steps" aria-label={t.workflowLabel}>
        {t.steps.map((label: string, index: number) => <div className="step" key={label}><span className="step-number">0{index + 1}</span><strong>{label}</strong></div>)}
      </nav>

      <section className="workbench" aria-label={t.matcherLabel}>
        <aside className="panel panel-profile">
          <div className="panel-heading"><span className="section-kicker">01</span><h3>{t.profileHeading}</h3></div>

          <fieldset className="field-group"><legend>{t.profile}</legend><div className="choice-stack">
            {profileOptions.map((item) => <button className="choice-button" key={item} type="button" aria-pressed={profile === item} onClick={() => { setProfile(item); setVisibleCandidateCount(candidatePageSize); }}><span className="choice-mark" aria-hidden="true">{profile === item ? "×" : ""}</span><span>{t.profiles[item]}</span></button>)}
          </div></fieldset>

          {profile !== "organization" ? <fieldset className="field-group"><legend>{profile === "collective" ? t.legalStatusCollective : t.legalStatusArtist}</legend><select className="field-select" value={legalStatus} onChange={(event) => setLegalStatus(event.target.value as LegalStatus)}>{legalStatusOptions.map((item) => <option key={item} value={item}>{t.legalStatuses[item]}</option>)}</select></fieldset> : null}

          {profile !== "organization" ? <fieldset className="field-group"><legend>{t.provinceHistory[provinceKey]}</legend><select className="field-select" value={provinceHistory} onChange={(event) => setProvinceHistory(event.target.value as ProvinceHistory)}>{provinceHistoryOptions.map((item) => <option key={item} value={item}>{t.provinceHistories[item]}</option>)}</select></fieldset> : null}

          {profile === "artist" && residence === "toronto" ? <fieldset className="field-group"><legend>{t.torontoHistory}</legend><select className="field-select" value={torontoHistory} onChange={(event) => setTorontoHistory(event.target.value as TorontoHistory)}>{torontoHistoryOptions.map((item) => <option key={item} value={item}>{t.torontoHistories[item]}</option>)}</select></fieldset> : null}

          {showTorontoQuestions ? <><fieldset className="field-group"><legend>{t.sinStatus}</legend><select className="field-select" value={sinStatus} onChange={(event) => setSinStatus(event.target.value as YesNoUnsure)}>{yesNoUnsureOptions.map((item) => <option key={item} value={item}>{t.yesNoUnsure[item]}</option>)}</select></fieldset><fieldset className="field-group"><legend>{t.canadaArrival}</legend><select className="field-select" value={canadaArrival} onChange={(event) => setCanadaArrival(event.target.value as CanadaArrival)}>{canadaArrivalOptions.map((item) => <option key={item} value={item}>{t.canadaArrivals[item]}</option>)}</select></fieldset></> : null}

          {showAgeQuestion ? <fieldset className="field-group"><legend>{t.ageBand}</legend><select className="field-select" value={ageBand} onChange={(event) => setAgeBand(event.target.value as AgeBand)}>{ageBandOptions.map((item) => <option key={item} value={item}>{t.ageBands[item]}</option>)}</select></fieldset> : null}

          {profile === "collective" ? <><fieldset className="field-group"><legend>{t.collectiveSize}</legend><select className="field-select" value={collectiveSize} onChange={(event) => setCollectiveSize(event.target.value as CollectiveSize)}>{collectiveSizeOptions.map((item) => <option key={item} value={item}>{t.collectiveSizes[item]}</option>)}</select></fieldset><fieldset className="field-group"><legend>{t.collectiveComposition}</legend><select className="field-select" value={collectiveComposition} onChange={(event) => setCollectiveComposition(event.target.value as CollectiveComposition)}>{collectiveCompositionOptions.map((item) => <option key={item} value={item}>{t.collectiveCompositions[item]}</option>)}</select><p className="field-note">{t.collectiveCompositionNote}</p></fieldset></> : null}

          {profile === "organization" ? <fieldset className="field-group"><legend>{t.organizationRegistration}</legend><select className="field-select" value={organizationRegistration} onChange={(event) => setOrganizationRegistration(event.target.value as OrganizationRegistration)}>{organizationRegistrationOptions.map((item) => <option key={item} value={item}>{t.organizationRegistrations[item]}</option>)}</select></fieldset> : null}

          <fieldset className="field-group"><legend>{t.discipline}</legend><div className="choice-stack">{disciplineOptions.map((item) => <button className="choice-button" key={item} type="button" aria-pressed={discipline === item} onClick={() => { setDiscipline(item); setVisibleCandidateCount(candidatePageSize); }}><span className="choice-mark" aria-hidden="true">{discipline === item ? "×" : ""}</span><span>{t.disciplines[item]}</span></button>)}</div></fieldset>
          <p className="profile-note">{t.profileNote}</p>
        </aside>

        <section className="panel panel-opportunities">
          <div className="panel-heading"><span className="section-kicker">02</span><h3>{t.callsHeading}</h3><span className="data-stamp">{candidateRoutes.length} {t.callsCount}</span></div>
          <div className="opportunity-list" id="candidate-opportunity-list">
            {candidateRoutes.length ? visibleCandidateRoutes.map((candidate) => {
              if (candidate.source === "radar") {
                const { radar } = candidate;
                return <button className="opportunity-row radar-candidate" type="button" key={candidate.candidateId} data-candidate-kind="radar" data-radar-candidate-id={radar.id} aria-current={selectedCandidate?.candidateId === candidate.candidateId} onClick={() => setSelectedCandidateId(candidate.candidateId)}><span className="row-topline"><span className="candidate-identifiers"><span className={`status-tag ${candidate.status}`}>{t.radar.status[candidate.status]}</span><span className="candidate-source">{t.radar.candidateSource}</span></span><span className={`deadline ${isUrgentDeadline(radar.deadlineDate) ? "urgent" : ""}`}>{radar.deadlineLabel[language]}</span></span><h4>{radar.title}</h4><p className="row-meta">{placeNames[language][radar.city] ?? radar.city} · {placeNames[language][radar.country] ?? radar.country} · {t.radar.families[radar.family]}</p><p className="candidate-participation">{t.radar.participation[radar.participation]}{radar.fundingReview ? ` · ${t.radar.fundingReviewStatus[radar.fundingReview.status]}` : ""}</p></button>;
              }
              const { opportunity } = candidate;
              return <button className="opportunity-row" type="button" key={candidate.candidateId} data-candidate-kind="call" aria-current={selectedCandidate?.candidateId === candidate.candidateId} onClick={() => setSelectedCandidateId(candidate.candidateId)}><span className="row-topline"><span className={`status-tag ${candidate.status}`}>{t.status[candidate.status]}</span><span className={`deadline ${isUrgent(opportunity) ? "urgent" : ""}`}>{opportunity.deadlineLabel[language]}</span></span><h4>{opportunity.title}</h4><p className="row-meta">{placeNames[language][opportunity.city] ?? opportunity.city} · {placeNames[language][opportunity.country] ?? opportunity.country} · {opportunity.organizer}</p></button>;
            }) : <p className="no-results">{t.noResults}</p>}
            {remainingCandidateCount ? <button className="show-more-opportunities" type="button" aria-controls="candidate-opportunity-list" onClick={() => setVisibleCandidateCount((count) => count + candidatePageSize)}>{t.showMoreCalls(nextCandidateBatchSize, remainingCandidateCount)}</button> : null}
          </div>
        </section>

        <section className="panel panel-funding" id="funding-panel">
          <div className="panel-heading"><span className="section-kicker">03</span><h3>{t.fundingHeading}</h3></div>
          {selectedCandidate ? selectedCandidate.source === "radar" ? <>
            <article className="selected-opportunity radar-selected-opportunity"><span className="section-kicker">{t.radar.candidateChosen}</span><h4>{selectedCandidate.radar.title}</h4><p>{placeNames[language][selectedCandidate.radar.city] ?? selectedCandidate.radar.city} · {placeNames[language][selectedCandidate.radar.country] ?? selectedCandidate.radar.country} · {t.radar.families[selectedCandidate.radar.family]}</p><div className="selected-radar-flags"><span className={`status-tag ${selectedCandidate.status}`}>{t.radar.status[selectedCandidate.status]}</span><span>{t.radar.participation[selectedCandidate.radar.participation]}</span></div><p>{selectedCandidate.radar.deadlineLabel[language]}</p><a className="source-link" href={selectedCandidate.radar.sourceUrl} target="_blank" rel="noreferrer">{t.radar.official}</a><span className="verified-date">{t.radar.verified}: {selectedCandidate.radar.verifiedAt}</span></article>
            {selectedCandidate.radar.fundingReview ? <>
              <aside className={`radar-funding-notice ${selectedCandidate.radar.fundingReview.status}`}><span className="section-kicker">{t.radar.fundingReviewHeading}</span><strong>{t.radar.fundingReviewStatus[selectedCandidate.radar.fundingReview.status]}</strong><p>{selectedCandidate.radar.fundingReview.note[language]}</p><span className="verified-date">{t.radar.fundingReviewed}: {selectedCandidate.radar.fundingReview.verifiedAt}</span></aside>
              {selectedCandidate.radar.fundingReview.status === "suggested" ? <><div className="matches-title radar-matches-title"><strong>{t.radar.fundingSuggested}</strong><span className="matches-count">{radarMatches.length}</span></div>{radarMatches.length ? <><div className="funding-list" id="radar-funding-list" data-visible-count={visibleRadarMatches.length} data-total-count={radarMatches.length}>{visibleRadarMatches.map(({ funding, match, assessment }) => renderFundingCard(funding, assessment, match.note[language]))}</div>{remainingRadarMatchCount ? <button className="show-more-funding" type="button" aria-controls="radar-funding-list" onClick={() => revealMoreFunding("radar", radarMatches.length)}>{t.showMoreFunding(nextRadarMatchBatchSize, remainingRadarMatchCount)}</button> : null}</> : <p className="no-results">{t.radar.fundingSuggestedForProfile}</p>}</> : null}
            </> : <aside className="radar-funding-notice"><strong>{t.radar.fundingCheck}</strong><p>{t.radar.fundingCheckNote}</p></aside>}
          </> : selectedOpportunity ? <>
            <article className="selected-opportunity"><span className="section-kicker">{t.chosen}</span><h4>{selectedOpportunity.title}</h4><p>{selectedOpportunity.summary[language]}</p><ul className="requirement-list">{selectedOpportunity.requirements[language].map((requirement) => <li key={requirement}>{requirement}</li>)}</ul><a className="source-link" href={selectedOpportunity.sourceUrl} target="_blank" rel="noreferrer">{t.officialCall}</a><span className="verified-date">{t.verified}: {selectedOpportunity.verifiedAt}</span></article>
            <div className="matches-title"><strong>{t.fundingFor}</strong><span className="matches-count">{matches.length}</span></div>
            {matches.length ? <><div className="funding-list" id="direct-funding-list" data-visible-count={visibleMatches.length} data-total-count={matches.length}>{visibleMatches.map(({ funding, match, assessment }) => renderFundingCard(funding, assessment, match.note[language]))}</div>{remainingMatchCount ? <button className="show-more-funding" type="button" aria-controls="direct-funding-list" onClick={() => revealMoreFunding("direct", matches.length)}>{t.showMoreFunding(nextMatchBatchSize, remainingMatchCount)}</button> : null}</> : <p className="no-results">{t.noFunding}</p>}

            {regionalPrograms.length ? <details className="regional-programs" open><summary><span>{t.regionalHeading} — {t.residences[residence]}</span><span className="matches-count">{regionalPrograms.length}</span></summary><div className="regional-list" id="regional-funding-list" data-visible-count={visibleRegionalPrograms.length} data-total-count={regionalPrograms.length}>{visibleRegionalPrograms.map(({ funding, assessment }) => renderFundingCard(funding, assessment, t.regionalNote, true))}</div>{remainingRegionalProgramCount ? <button className="show-more-funding" type="button" aria-controls="regional-funding-list" onClick={() => revealMoreFunding("regional", regionalPrograms.length)}>{t.showMoreFunding(nextRegionalProgramBatchSize, remainingRegionalProgramCount)}</button> : null}</details> : null}
            <p className="honesty-note">{t.sourceNote}</p>
          </> : <p className="no-results">{t.noResults}</p> : <p className="no-results">{t.noResults}</p>}
        </section>
      </section>

      <div className="below-fold"><section><span className="section-kicker">{t.whyKicker}</span><h3>{t.whyTitle}</h3><p>{t.whyBody}</p></section><section><span className="section-kicker">{t.rulesKicker}</span><h3>{t.rulesTitle}</h3><ol className="principles">{t.rules.map((rule: string) => <li key={rule}>{rule}</li>)}</ol></section></div>
      <footer className="footer"><div><strong>{t.footer}</strong><span>{t.footerNote}</span></div><Link className="footer-ledger-link" href="/radar">{t.radarLink} →</Link></footer>
    </main>
  );
}

export function FestivalRadarLedger() {
  const [language, setLanguage] = useState<Language>("fr");
  const [radarFamily, setRadarFamily] = useState<RadarFamily>("all");
  const [radarSearchTag, setRadarSearchTag] = useState<RadarSearchTag>("all");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr-CA" : language === "en" ? "en-CA" : "ja";
  }, [language]);

  const filteredRadar = useMemo(
    () => festivalRadar
      .filter((record) => radarFamily === "all" || record.family === radarFamily)
      .filter((record) => radarSearchTag === "all" || radarSearchTagsOf(record).includes(radarSearchTag))
      .sort((a, b) => {
        const statusDifference = radarStatusOrder[normalizedRadarStatus(a)] - radarStatusOrder[normalizedRadarStatus(b)];
        if (statusDifference) return statusDifference;
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return a.deadlineDate.localeCompare(b.deadlineDate);
      }),
    [radarFamily, radarSearchTag],
  );

  return (
    <main className="site-shell radar-page-shell">
      <header className="masthead">
        <div className="brandline"><h1 className="brand">MESURE</h1><span className="edition">{t.ledgerEdition}</span></div>
        <div className="header-actions">
          <Link className="page-return-link" href="/">← {t.backToSearch}</Link>
          <div className="language-switch" aria-label={t.languageLabel}>
            {(["fr", "en", "ja"] as Language[]).map((item) => <button key={item} type="button" aria-pressed={language === item} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}
          </div>
        </div>
      </header>

      <div className="site-notices">
        <aside className="source-notice" aria-label={t.sourceNotice.label}>
          <strong>{t.sourceNotice.label}</strong>
          <span>{t.sourceNotice.text}</span>
        </aside>
        <aside className="beta-notice" aria-label={t.betaNotice.label}>
          <strong>{t.betaNotice.label}</strong>
          <span>{t.betaNotice.before} <a href={feedbackFormUrl} target="_blank" rel="noreferrer">{t.betaNotice.link}</a>{t.betaNotice.after}</span>
        </aside>
      </div>

      <section className="festival-radar" aria-labelledby="festival-radar-heading">
        <div className="radar-intro">
          <div><span className="section-kicker">{t.radar.kicker}</span><h2 id="festival-radar-heading">{t.radar.heading}</h2></div>
          <div><p>{t.radar.intro}</p><span className="data-stamp">{festivalRadar.length} {t.radar.count} · {new Set(festivalRadar.map((record) => record.region)).size} {t.radar.regions}</span></div>
        </div>
        <div className="radar-filter-group">
          <span className="radar-filter-label">{t.radar.familyFilter}</span>
          <div className="radar-filters" aria-label={t.radar.familyFilter}>
            {radarFamilyOptions.map((family) => <button type="button" key={family} aria-pressed={radarFamily === family} onClick={() => setRadarFamily(family)}>{family === "all" ? t.radar.all : t.radar.families[family]}</button>)}
          </div>
        </div>
        <div className="radar-filter-group radar-format-group">
          <span className="radar-filter-label">{t.radar.formatFilter}</span>
          <div className="radar-filters radar-format-filters" aria-label={t.radar.formatFilter}>
            {radarSearchTagOptions.map((tag) => {
              const count = tag === "all" ? festivalRadar.length : festivalRadar.filter((record) => radarSearchTagMatchers[tag](record)).length;
              const label = tag === "all" ? t.radar.all : t.radar.searchTags[tag];
              return <button type="button" key={tag} aria-pressed={radarSearchTag === tag} title={tag === "all" ? undefined : t.radar.searchTagDescriptions[tag]} onClick={() => setRadarSearchTag(tag)}><span>{label}</span><small>{count}</small></button>;
            })}
          </div>
        </div>
        <div className="radar-ledger" id="radar-ledger-page">
          {filteredRadar.length ? filteredRadar.map((record) => {
            const status = normalizedRadarStatus(record);
            const searchTags = radarSearchTagsOf(record);
            return <article className="radar-row" key={record.id}>
              <div className="radar-row-topline"><span className={`status-tag radar-${status}`}>{t.radar.status[status]}</span><span className="radar-family">{t.radar.families[record.family]}</span></div>
              <h3>{record.title}</h3>
              <p className="row-meta">{placeNames[language][record.city] ?? record.city} · {placeNames[language][record.country] ?? record.country}</p>
              {searchTags.length ? <div className="radar-search-tags">{searchTags.map((tag) => <span key={tag}>{t.radar.searchTags[tag]}</span>)}</div> : null}
              <p className="radar-deadline">{record.deadlineLabel[language]}</p>
              <div className="radar-bottom"><span>{t.radar.participation[record.participation]}</span><span>{t.radar.nextCheck}: {record.nextCheckDate}</span></div>
              {record.linkedOpportunityId ? <span className="radar-funding-state linked">{t.radar.fundingLinked}</span> : record.fundingReview ? <span className={`radar-funding-state ${record.fundingReview.status}`}>{t.radar.fundingReviewStatus[record.fundingReview.status]}</span> : null}
              <div className="radar-source-links">
                <a className="source-link" href={record.sourceUrl} target="_blank" rel="noreferrer">{t.radar.official}</a>
                {record.networkSourceUrl ? <a className="source-link secondary-source-link" href={record.networkSourceUrl} target="_blank" rel="noreferrer">{t.radar.network}</a> : null}
              </div>
              <span className="verified-date">{t.radar.verified}: {record.verifiedAt}</span>
            </article>;
          }) : <p className="radar-empty">{t.radar.noTagResults}</p>}
        </div>
        <p className="radar-note">{t.radar.note}</p>
      </section>

      <footer className="footer"><div><strong>{t.footer}</strong><span>{t.footerNote}</span></div><Link className="footer-ledger-link" href="/">← {t.backToSearch}</Link></footer>
    </main>
  );
}
