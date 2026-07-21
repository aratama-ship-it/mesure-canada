"use client";

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
  verifiedAt: string;
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

const copy = {
  fr: {
    edition: "Édition Canada · Québec + Ontario",
    eyebrow: "Appels + financement, mesurés depuis votre base",
    headline: "Avant d’envoyer le dossier, mesurez tout le trajet.",
    intro:
      "Choisissez votre ville de résidence, votre statut et une occasion. MESURE distingue les programmes nationaux, provinciaux et municipaux — y compris les cas où la citoyenneté canadienne n’est pas exigée.",
    stamp: `${opportunities.length} appels liés · ${festivalRadar.length} pistes festivals + marchés · ${fundingPrograms.length} programmes · vérifiés le 21 juillet 2026`,
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
    radar: {
      kicker: "Radar international",
      heading: "Festivals et marchés à suivre, sans mélanger les appels fermés aux accès actifs.",
      intro: "Un registre de sources officielles pour le cirque, les arts de la rue, les fringes, le cinéma et les marchés professionnels. Chaque ligne indique si la voie est active, attendue ou à surveiller.",
      count: "pistes officielles",
      all: "Tous",
      families: { circus: "Cirque", street: "Arts de la rue", fringe: "Fringe", film: "Cinéma", showcase: "Vitrines / marchés" },
      participation: { international: "Candidature internationale", open_access: "Accès libre", selection: "Sélection sur dossier", regional_conditions: "Conditions locales à vérifier", language_conditions: "Conditions linguistiques à vérifier", eligibility_check: "Admissibilité à confirmer" },
      status: { open: "Ouvert", upcoming: "À venir", watch: "À surveiller" },
      official: "Voir la source officielle ↗",
      nextCheck: "Prochaine vérification",
      verified: "Vérifié le",
      note: "Le registre n’affirme jamais qu’un appel est ouvert au-delà de la date vérifiée. Ouvrez la source avant de préparer un dossier.",
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
    eyebrow: "Calls + funding, measured from your home base",
    headline: "Before you submit, measure the whole route.",
    intro: "Choose your current city, status and one opportunity. MESURE separates national, provincial and municipal programs—including cases where Canadian citizenship is not required.",
    stamp: `${opportunities.length} linked calls · ${festivalRadar.length} festival + market routes · ${fundingPrograms.length} programs · checked July 21, 2026`,
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
    radar: {
      kicker: "International radar",
      heading: "Festivals and markets to follow—without mixing closed cycles into live access.",
      intro: "An official-source register for circus, street arts, Fringe, film and professional markets. Each line says whether the route is live, about to open or worth watching.",
      count: "official routes",
      all: "All",
      families: { circus: "Circus", street: "Street arts", fringe: "Fringe", film: "Film", showcase: "Showcases / markets" },
      participation: { international: "International applications", open_access: "Open access", selection: "Curated selection", regional_conditions: "Local conditions to check", language_conditions: "Language conditions to check", eligibility_check: "Eligibility to confirm" },
      status: { open: "Open", upcoming: "Opening soon", watch: "Watch next cycle" },
      official: "Open official source ↗",
      nextCheck: "Next check",
      verified: "Verified",
      note: "This register never treats an old deadline as live. Open the official source before preparing a submission.",
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
    eyebrow: "居住地から、公募と助成の距離を測る",
    headline: "応募する前に、実現までの道のりを測る。",
    intro: "現在の居住地、在留資格、公募を選ぶと、国・州・市の制度を分けて判定します。カナダ市民でなくても利用できる制度と、個別確認が必要な制度も区別します。",
    stamp: `${opportunities.length}件の資金連動公募 · ${festivalRadar.length}件のフェス・ショーケースルート · ${fundingPrograms.length}件の制度 · 2026年7月21日確認`,
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
    radar: {
      kicker: "国際公募・ショーケース レーダー",
      heading: "終了した募集を「募集中」に見せず、フェスと市場の次の入口を追えるようにする。",
      intro: "サーカス、大道芸、フリンジ、映画、プロ向けショーケースを対象に、公式情報だけを記録した監視台帳です。各行は、募集中・開始予定・次回監視のどれかを示します。",
      count: "件の公式ルート",
      all: "すべて",
      families: { circus: "サーカス", street: "大道芸・公共空間", fringe: "フリンジ", film: "映画", showcase: "ショーケース・市場" },
      participation: { international: "国際応募可", open_access: "オープンアクセス", selection: "選考型", regional_conditions: "地域条件を要確認", language_conditions: "言語条件を要確認", eligibility_check: "応募資格を要確認" },
      status: { open: "募集中", upcoming: "開始予定", watch: "次回を監視" },
      official: "公式情報を開く ↗",
      nextCheck: "次回確認日",
      verified: "公式情報の確認日",
      note: "古い締切を「募集中」とは扱いません。応募準備の前に必ず公式情報を開いてください。",
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

function isUrgent(opportunity: Opportunity) {
  if (!opportunity.deadlineDate) return false;
  const remainingDays = (new Date(`${opportunity.deadlineDate}T23:59:59`).getTime() - Date.now()) / 86_400_000;
  return remainingDays >= 0 && remainingDays <= 21;
}

function normalizedRadarStatus(record: FestivalRadar) {
  if (record.status === "open" && record.deadlineDate) {
    const deadline = new Date(`${record.deadlineDate}T23:59:59`);
    if (Date.now() > deadline.getTime()) return "watch" as const;
  }
  return record.status;
}

const radarStatusOrder: Record<RadarStatus, number> = { open: 0, upcoming: 1, watch: 2 };

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
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id ?? "");
  const [radarFamily, setRadarFamily] = useState<RadarFamily>("all");
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

  const selectedOpportunity = filteredOpportunities.find((opportunity) => opportunity.id === selectedId) ?? filteredOpportunities[0];

  const filteredRadar = useMemo(
    () => festivalRadar
      .filter((record) => radarFamily === "all" || record.family === radarFamily)
      .sort((a, b) => {
        const statusDifference = radarStatusOrder[normalizedRadarStatus(a)] - radarStatusOrder[normalizedRadarStatus(b)];
        if (statusDifference) return statusDifference;
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return a.deadlineDate.localeCompare(b.deadlineDate);
      }),
    [radarFamily],
  );

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

  const regionalPrograms = useMemo(() => {
    const directIds = new Set(selectedOpportunity?.fundingMatches.map((match) => match.fundingId) ?? []);
    return fundingPrograms
      .filter((funding) => !directIds.has(funding.id))
      .filter((funding) => funding.profiles.includes(profile))
      .filter((funding) => supportsResidence(funding, residence))
      .filter((funding) => discipline === "all" || funding.disciplines.includes("all") || funding.disciplines.includes(discipline))
      .map((funding) => ({ funding, assessment: evaluateFundingEligibility({ funding, baseState: "possible", ...answers }) as Assessment }))
      .sort((a, b) => stateOrder[a.assessment.state] - stateOrder[b.assessment.state] || a.funding.name.localeCompare(b.funding.name));
  }, [answers, discipline, profile, residence, selectedOpportunity]);

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
            {profileOptions.map((item) => <button className="choice-button" key={item} type="button" aria-pressed={profile === item} onClick={() => setProfile(item)}><span className="choice-mark" aria-hidden="true">{profile === item ? "×" : ""}</span><span>{t.profiles[item]}</span></button>)}
          </div></fieldset>

          {profile !== "organization" ? <fieldset className="field-group"><legend>{profile === "collective" ? t.legalStatusCollective : t.legalStatusArtist}</legend><select className="field-select" value={legalStatus} onChange={(event) => setLegalStatus(event.target.value as LegalStatus)}>{legalStatusOptions.map((item) => <option key={item} value={item}>{t.legalStatuses[item]}</option>)}</select></fieldset> : null}

          {profile !== "organization" ? <fieldset className="field-group"><legend>{t.provinceHistory[provinceKey]}</legend><select className="field-select" value={provinceHistory} onChange={(event) => setProvinceHistory(event.target.value as ProvinceHistory)}>{provinceHistoryOptions.map((item) => <option key={item} value={item}>{t.provinceHistories[item]}</option>)}</select></fieldset> : null}

          {profile === "artist" && residence === "toronto" ? <fieldset className="field-group"><legend>{t.torontoHistory}</legend><select className="field-select" value={torontoHistory} onChange={(event) => setTorontoHistory(event.target.value as TorontoHistory)}>{torontoHistoryOptions.map((item) => <option key={item} value={item}>{t.torontoHistories[item]}</option>)}</select></fieldset> : null}

          {showTorontoQuestions ? <><fieldset className="field-group"><legend>{t.sinStatus}</legend><select className="field-select" value={sinStatus} onChange={(event) => setSinStatus(event.target.value as YesNoUnsure)}>{yesNoUnsureOptions.map((item) => <option key={item} value={item}>{t.yesNoUnsure[item]}</option>)}</select></fieldset><fieldset className="field-group"><legend>{t.canadaArrival}</legend><select className="field-select" value={canadaArrival} onChange={(event) => setCanadaArrival(event.target.value as CanadaArrival)}>{canadaArrivalOptions.map((item) => <option key={item} value={item}>{t.canadaArrivals[item]}</option>)}</select></fieldset></> : null}

          {showAgeQuestion ? <fieldset className="field-group"><legend>{t.ageBand}</legend><select className="field-select" value={ageBand} onChange={(event) => setAgeBand(event.target.value as AgeBand)}>{ageBandOptions.map((item) => <option key={item} value={item}>{t.ageBands[item]}</option>)}</select></fieldset> : null}

          {profile === "collective" ? <><fieldset className="field-group"><legend>{t.collectiveSize}</legend><select className="field-select" value={collectiveSize} onChange={(event) => setCollectiveSize(event.target.value as CollectiveSize)}>{collectiveSizeOptions.map((item) => <option key={item} value={item}>{t.collectiveSizes[item]}</option>)}</select></fieldset><fieldset className="field-group"><legend>{t.collectiveComposition}</legend><select className="field-select" value={collectiveComposition} onChange={(event) => setCollectiveComposition(event.target.value as CollectiveComposition)}>{collectiveCompositionOptions.map((item) => <option key={item} value={item}>{t.collectiveCompositions[item]}</option>)}</select><p className="field-note">{t.collectiveCompositionNote}</p></fieldset></> : null}

          {profile === "organization" ? <fieldset className="field-group"><legend>{t.organizationRegistration}</legend><select className="field-select" value={organizationRegistration} onChange={(event) => setOrganizationRegistration(event.target.value as OrganizationRegistration)}>{organizationRegistrationOptions.map((item) => <option key={item} value={item}>{t.organizationRegistrations[item]}</option>)}</select></fieldset> : null}

          <fieldset className="field-group"><legend>{t.discipline}</legend><div className="choice-stack">{disciplineOptions.map((item) => <button className="choice-button" key={item} type="button" aria-pressed={discipline === item} onClick={() => setDiscipline(item)}><span className="choice-mark" aria-hidden="true">{discipline === item ? "×" : ""}</span><span>{t.disciplines[item]}</span></button>)}</div></fieldset>
          <p className="profile-note">{t.profileNote}</p>
        </aside>

        <section className="panel panel-opportunities">
          <div className="panel-heading"><span className="section-kicker">02</span><h3>{t.callsHeading}</h3><span className="data-stamp">{filteredOpportunities.length} {t.callsCount}</span></div>
          <div className="opportunity-list">
            {filteredOpportunities.length ? filteredOpportunities.map((opportunity) => {
              const status = normalizedStatus(opportunity);
              return <button className="opportunity-row" type="button" key={opportunity.id} aria-current={selectedOpportunity?.id === opportunity.id} onClick={() => setSelectedId(opportunity.id)}><span className="row-topline"><span className={`status-tag ${status}`}>{t.status[status]}</span><span className={`deadline ${isUrgent(opportunity) ? "urgent" : ""}`}>{opportunity.deadlineLabel[language]}</span></span><h4>{opportunity.title}</h4><p className="row-meta">{placeNames[language][opportunity.city] ?? opportunity.city} · {placeNames[language][opportunity.country] ?? opportunity.country} · {opportunity.organizer}</p></button>;
            }) : <p className="no-results">{t.noResults}</p>}
          </div>
        </section>

        <section className="panel panel-funding" id="funding-panel">
          <div className="panel-heading"><span className="section-kicker">03</span><h3>{t.fundingHeading}</h3></div>
          {selectedOpportunity ? <>
            <article className="selected-opportunity"><span className="section-kicker">{t.chosen}</span><h4>{selectedOpportunity.title}</h4><p>{selectedOpportunity.summary[language]}</p><ul className="requirement-list">{selectedOpportunity.requirements[language].map((requirement) => <li key={requirement}>{requirement}</li>)}</ul><a className="source-link" href={selectedOpportunity.sourceUrl} target="_blank" rel="noreferrer">{t.officialCall}</a><span className="verified-date">{t.verified}: {selectedOpportunity.verifiedAt}</span></article>
            <div className="matches-title"><strong>{t.fundingFor}</strong><span className="matches-count">{matches.length}</span></div>
            {matches.length ? <div className="funding-list">{matches.map(({ funding, match, assessment }) => renderFundingCard(funding, assessment, match.note[language]))}</div> : <p className="no-results">{t.noFunding}</p>}

            {regionalPrograms.length ? <details className="regional-programs" open><summary><span>{t.regionalHeading} — {t.residences[residence]}</span><span className="matches-count">{regionalPrograms.length}</span></summary><div className="regional-list">{regionalPrograms.map(({ funding, assessment }) => renderFundingCard(funding, assessment, t.regionalNote, true))}</div></details> : null}
            <p className="honesty-note">{t.sourceNote}</p>
          </> : <p className="no-results">{t.noResults}</p>}
        </section>
      </section>

      <section className="festival-radar" aria-labelledby="festival-radar-heading">
        <div className="radar-intro">
          <div><span className="section-kicker">{t.radar.kicker}</span><h3 id="festival-radar-heading">{t.radar.heading}</h3></div>
          <div><p>{t.radar.intro}</p><span className="data-stamp">{festivalRadar.length} {t.radar.count} · {new Set(festivalRadar.map((record) => record.region)).size} regions</span></div>
        </div>
        <div className="radar-filters" aria-label={t.radar.kicker}>
          {radarFamilyOptions.map((family) => <button type="button" key={family} aria-pressed={radarFamily === family} onClick={() => setRadarFamily(family)}>{family === "all" ? t.radar.all : t.radar.families[family]}</button>)}
        </div>
        <div className="radar-ledger">
          {filteredRadar.map((record) => {
            const status = normalizedRadarStatus(record);
            return <article className="radar-row" key={record.id}>
              <div className="radar-row-topline"><span className={`status-tag radar-${status}`}>{t.radar.status[status]}</span><span className="radar-family">{t.radar.families[record.family]}</span></div>
              <h4>{record.title}</h4>
              <p className="row-meta">{placeNames[language][record.city] ?? record.city} · {placeNames[language][record.country] ?? record.country}</p>
              <p className="radar-deadline">{record.deadlineLabel[language]}</p>
              <div className="radar-bottom"><span>{t.radar.participation[record.participation]}</span><span>{t.radar.nextCheck}: {record.nextCheckDate}</span></div>
              <a className="source-link" href={record.sourceUrl} target="_blank" rel="noreferrer">{t.radar.official}</a>
              <span className="verified-date">{t.radar.verified}: {record.verifiedAt}</span>
            </article>;
          })}
        </div>
        <p className="radar-note">{t.radar.note}</p>
      </section>

      <div className="below-fold"><section><span className="section-kicker">{t.whyKicker}</span><h3>{t.whyTitle}</h3><p>{t.whyBody}</p></section><section><span className="section-kicker">{t.rulesKicker}</span><h3>{t.rulesTitle}</h3><ol className="principles">{t.rules.map((rule: string) => <li key={rule}>{rule}</li>)}</ol></section></div>
      <footer className="footer"><strong>{t.footer}</strong><span>{t.footerNote}</span></footer>
    </main>
  );
}
