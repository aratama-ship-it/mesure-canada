"use client";

import { useEffect, useMemo, useState } from "react";
import fundingData from "../data/funding.json";
import opportunityData from "../data/opportunities.json";
import { evaluateFundingEligibility } from "./eligibility.mjs";

type Language = "fr" | "en" | "ja";
type Profile = "artist" | "collective" | "organization";
type Residence = "montreal" | "quebec";
type Discipline = "all" | "circus" | "theatre" | "dance" | "music";
type MatchState = "possible" | "conditional" | "verify" | "ineligible";
type FundingMatchState = Exclude<MatchState, "ineligible">;
type LegalStatus = "citizen" | "permanent" | "protected" | "temporary" | "unsure";
type QuebecHistory = "twelve_plus" | "under_twelve" | "unsure";
type CollectiveComposition = "all" | "two_thirds" | "half_qualified" | "under_half" | "unsure";
type OrganizationRegistration = "yes" | "no" | "unsure";
type EligibilityReasonKey =
  | "statusUnknown"
  | "statusNotAccepted"
  | "residencyUnknown"
  | "residencyTooShort"
  | "groupUnknown"
  | "groupNotEnough"
  | "organizationUnknown"
  | "organizationNotEligible";

type Localized = Record<Language, string>;

type FundingMatch = {
  fundingId: string;
  state: FundingMatchState;
  note: Localized;
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
  residencies: ("montreal" | "quebec")[];
  disciplines: Discipline[];
  deadline: Localized;
  amount: Localized;
  coverage: string[];
  cashflow: Localized;
  eligibility: {
    individualStatuses?: LegalStatus[];
    representativeStatuses?: LegalStatus[];
    minimumQuebecMonths?: 12;
    collectiveRule?: "cca_half" | "cam_two_thirds";
    organizationRegisteredInCanada?: true;
    note: Localized;
    sourceUrl: string;
    verifiedAt: string;
  };
  sourceUrl: string;
  verifiedAt: string;
};

const opportunities = opportunityData as Opportunity[];
const fundingPrograms = fundingData as Funding[];

const copy = {
  fr: {
    edition: "Prototype Montréal · Données vérifiées",
    eyebrow: "Appels + financement, sur le même bureau",
    headline: "Avant d’envoyer le dossier, mesurez tout le trajet.",
    intro:
      "Choisissez votre situation et une occasion. MESURE indique les aides qui peuvent soutenir le déplacement, la tournée ou la production — et le document encore manquant.",
    stamp: `${opportunities.length} appels · ${fundingPrograms.length} programmes · vérifiés les 19–20 juillet 2026`,
    steps: ["Votre situation", "Une occasion concrète", "Le financement possible"],
    profileHeading: "Point de départ",
    profile: "Vous déposez comme…",
    residence: "Votre base au Québec",
    discipline: "Votre discipline",
    profiles: {
      artist: "Artiste individuel·le",
      collective: "Collectif non incorporé",
      organization: "Organisme / compagnie",
    },
    residences: { montreal: "Île de Montréal", quebec: "Ailleurs au Québec" },
    disciplines: {
      all: "Toutes",
      circus: "Cirque / jonglerie",
      theatre: "Théâtre",
      dance: "Danse",
      music: "Musique",
    },
    legalStatusArtist: "Votre statut au Canada",
    legalStatusCollective: "Statut de la personne responsable",
    legalStatuses: {
      citizen: "Citoyenneté canadienne",
      permanent: "Résidence permanente",
      protected: "Personne protégée",
      temporary: "Statut temporaire (travail, études, etc.)",
      unsure: "Je ne sais pas / à vérifier",
    },
    quebecHistory: "Résidence au Québec au cours des 12 derniers mois",
    quebecHistories: {
      twelve_plus: "Oui, 12 mois ou plus",
      under_twelve: "Non, moins de 12 mois",
      unsure: "Je ne sais pas / à vérifier",
    },
    collectiveComposition: "Composition du collectif",
    collectiveCompositions: {
      all: "Tous les membres ont un statut reconnu",
      two_thirds: "Au moins 2/3 sont citoyens ou résidents permanents",
      half_qualified: "Au moins la moitié ont un statut reconnu par le Conseil des arts du Canada",
      under_half: "Moins de la moitié ont un statut reconnu",
      unsure: "Je ne sais pas / à vérifier",
    },
    collectiveCompositionNote: "Pour un groupe de deux personnes, choisissez « tous les membres » seulement si les deux ont un statut reconnu.",
    organizationRegistration: "Statut juridique de l’organisme",
    organizationRegistrations: {
      yes: "Constitué ou enregistré au Canada",
      no: "Non constitué ou non enregistré au Canada",
      unsure: "Je ne sais pas / à vérifier",
    },
    profileNote:
      "Ce prototype ne décide pas à la place du bailleur. Il sépare ce qui paraît possible, ce qui dépend d’une invitation et ce qui doit être confirmé.",
    callsHeading: "Appels pertinents",
    callsCount: "résultats",
    noResults: "Aucun appel de l’échantillon ne correspond à ce profil. Essayez une autre discipline.",
    fundingHeading: "Plan de financement",
    chosen: "Occasion choisie",
    officialCall: "Voir l’appel officiel ↗",
    fundingFor: "Aides associées",
    noFunding:
      "Aucune aide directe n’est associée automatiquement. C’est volontaire : une occasion locale ou un concours sans preuve de déplacement ne doit pas produire un faux match.",
    officialFunding: "Vérifier le programme officiel ↗",
    eligibilityHeading: "Contrôle d’admissibilité",
    eligibilitySource: "Vérifier les critères officiels ↗",
    eligibilityReasons: {
      statusUnknown: "Le statut au Canada doit être confirmé.",
      statusNotAccepted: "Le statut sélectionné n’est pas admissible à ce programme.",
      residencyUnknown: "La durée de résidence au Québec doit être confirmée.",
      residencyTooShort: "Ce programme exige 12 mois de résidence habituelle au Québec.",
      groupUnknown: "La composition du collectif doit être confirmée.",
      groupNotEnough: "Le collectif n’atteint pas le seuil de membres admissibles.",
      organizationUnknown: "La constitution ou l’enregistrement canadien doit être confirmé.",
      organizationNotEligible: "Un organisme constitué ou enregistré au Canada est requis.",
    },
    states: {
      possible: "Possible maintenant",
      conditional: "Possible sous condition",
      verify: "À confirmer",
      ineligible: "Non admissible selon ces réponses",
    },
    coverage: {
      travel: "transport",
      stay: "séjour",
      visa: "visa",
      transport: "équipement",
      promotion: "promotion",
      market: "prospection",
      touring: "tournée",
      fees: "honoraires",
      production: "production",
      research: "recherche",
      creation: "création",
    },
    sourceNote:
      "Lecture de présélection seulement. La page officielle, la date de vérification et la preuve demandée restent visibles avant toute décision.",
    verified: "Information officielle vérifiée le",
    languageLabel: "Langue d’affichage",
    workflowLabel: "Parcours de vérification",
    matcherLabel: "Correspondance entre appels et financement",
    eligibleCostsLabel: "Types de dépenses admissibles",
    whyKicker: "Pourquoi ce prototype",
    whyTitle: "Une liste dit ce qui existe. Une mesure dit ce qui manque.",
    whyBody:
      "Les sites officiels restent la source de vérité. MESURE sert avant eux : il rapproche une occasion réelle des aides accessibles selon le lieu de résidence, le statut du demandeur et le moment du projet.",
    rulesKicker: "Règles de confiance",
    rulesTitle: "Pas de “match parfait” inventé.",
    rules: [
      "Pays et villes sont stockés en valeurs absolues, jamais comme « étranger ».",
      "Une invitation, un contrat ou un diffuseur reconnu restent des conditions visibles.",
      "Chaque donnée sensible renvoie vers sa source officielle et sa date de vérification.",
    ],
    footer: "MESURE — Québec · MVP de validation",
    footerNote: "Données limitées à un échantillon. Aucun résultat ne garantit l’admissibilité ni l’obtention d’une aide.",
    status: { open: "Ouvert", rolling: "En continu", upcoming: "Bientôt", closed: "Fermé" },
  },
  en: {
    edition: "Montréal prototype · Verified data",
    eyebrow: "Calls + funding, on one working surface",
    headline: "Before you submit, measure the whole route.",
    intro:
      "Choose your situation and one opportunity. MESURE shows which programs may support travel, touring or production — and which proof is still missing.",
    stamp: `${opportunities.length} calls · ${fundingPrograms.length} programs · checked July 19–20, 2026`,
    steps: ["Your situation", "A concrete opportunity", "Possible funding"],
    profileHeading: "Starting point",
    profile: "You are applying as…",
    residence: "Your Québec base",
    discipline: "Your discipline",
    profiles: {
      artist: "Individual artist",
      collective: "Unincorporated collective",
      organization: "Organization / company",
    },
    residences: { montreal: "Island of Montréal", quebec: "Elsewhere in Québec" },
    disciplines: {
      all: "All",
      circus: "Circus / juggling",
      theatre: "Theatre",
      dance: "Dance",
      music: "Music",
    },
    legalStatusArtist: "Your status in Canada",
    legalStatusCollective: "Status of the application representative",
    legalStatuses: {
      citizen: "Canadian citizen",
      permanent: "Permanent resident",
      protected: "Protected Person",
      temporary: "Temporary status (work, study, etc.)",
      unsure: "Not sure / needs checking",
    },
    quebecHistory: "Residence in Québec during the previous 12 months",
    quebecHistories: {
      twelve_plus: "Yes, 12 months or more",
      under_twelve: "No, less than 12 months",
      unsure: "Not sure / needs checking",
    },
    collectiveComposition: "Collective composition",
    collectiveCompositions: {
      all: "All members hold a recognized status",
      two_thirds: "At least 2/3 are citizens or permanent residents",
      half_qualified: "At least half hold a Canada Council-recognized status",
      under_half: "Fewer than half hold a recognized status",
      unsure: "Not sure / needs checking",
    },
    collectiveCompositionNote: "For a two-person group, choose “all members” only when both people hold a recognized status.",
    organizationRegistration: "Organization’s legal status",
    organizationRegistrations: {
      yes: "Incorporated or registered in Canada",
      no: "Not incorporated or registered in Canada",
      unsure: "Not sure / needs checking",
    },
    profileNote:
      "This prototype does not decide for the funder. It separates what looks possible, what depends on an invitation, and what still needs confirmation.",
    callsHeading: "Relevant calls",
    callsCount: "results",
    noResults: "No call in this sample matches the profile. Try another discipline.",
    fundingHeading: "Funding plan",
    chosen: "Selected opportunity",
    officialCall: "Open official call ↗",
    fundingFor: "Linked programs",
    noFunding:
      "No direct funding is attached automatically. This is intentional: a local opportunity or a competition without travel proof should not create a false match.",
    officialFunding: "Check official program ↗",
    eligibilityHeading: "Eligibility checkpoint",
    eligibilitySource: "Check official eligibility rules ↗",
    eligibilityReasons: {
      statusUnknown: "Status in Canada still needs confirmation.",
      statusNotAccepted: "The selected status is not eligible for this program.",
      residencyUnknown: "Length of Québec residence still needs confirmation.",
      residencyTooShort: "This program requires 12 months of habitual residence in Québec.",
      groupUnknown: "The collective’s composition still needs confirmation.",
      groupNotEnough: "The collective does not meet the qualifying-member threshold.",
      organizationUnknown: "Canadian incorporation or registration still needs confirmation.",
      organizationNotEligible: "A Canadian-incorporated or registered organization is required.",
    },
    states: {
      possible: "Possible now",
      conditional: "Possible with conditions",
      verify: "Needs confirmation",
      ineligible: "Not eligible from these answers",
    },
    coverage: {
      travel: "travel",
      stay: "stay",
      visa: "visa",
      transport: "equipment",
      promotion: "promotion",
      market: "market access",
      touring: "touring",
      fees: "fees",
      production: "production",
      research: "research",
      creation: "creation",
    },
    sourceNote:
      "This is a pre-screen only. The official page, verification date and required proof remain visible before any decision.",
    verified: "Official information checked",
    languageLabel: "Display language",
    workflowLabel: "Matching workflow",
    matcherLabel: "Opportunity and funding matcher",
    eligibleCostsLabel: "Eligible cost types",
    whyKicker: "Why this prototype",
    whyTitle: "A list tells you what exists. A measure tells you what is missing.",
    whyBody:
      "Official websites remain the source of truth. MESURE works one step earlier: it connects a real opportunity with funding based on residence, applicant status and project timing.",
    rulesKicker: "Trust rules",
    rulesTitle: "No invented “perfect match.”",
    rules: [
      "Countries and cities use absolute values, never the relative label “abroad.”",
      "Invitations, contracts and recognized presenters remain visible conditions.",
      "Every sensitive field links to an official source and a verification date.",
    ],
    footer: "MESURE — Québec · Validation MVP",
    footerNote: "Limited sample data. No result guarantees eligibility or funding.",
    status: { open: "Open", rolling: "Rolling", upcoming: "Upcoming", closed: "Closed" },
  },
  ja: {
    edition: "モントリオール版プロトタイプ · 公式情報を確認済み",
    eyebrow: "公募と助成を、ひとつの作業机に",
    headline: "応募する前に、実現までの道のりを測る。",
    intro:
      "申請者の状況と公募を選ぶと、渡航・ツアー・制作に利用できる可能性のある助成と、まだ不足している証明書類を確認できます。",
    stamp: `${opportunities.length}件の公募 · ${fundingPrograms.length}件の助成制度 · 2026年7月19〜20日確認`,
    steps: ["申請者の状況", "具体的な公募", "利用可能性のある助成"],
    profileHeading: "出発点",
    profile: "申請主体",
    residence: "ケベック州内の拠点",
    discipline: "活動分野",
    profiles: {
      artist: "個人アーティスト",
      collective: "法人格のないコレクティブ",
      organization: "団体・カンパニー",
    },
    residences: { montreal: "モントリオール島内", quebec: "ケベック州内（モントリオール島外）" },
    disciplines: {
      all: "すべて",
      circus: "サーカス・ジャグリング",
      theatre: "演劇",
      dance: "ダンス",
      music: "音楽",
    },
    legalStatusArtist: "カナダでの在留資格",
    legalStatusCollective: "申請代表者の在留資格",
    legalStatuses: {
      citizen: "カナダ市民",
      permanent: "永住者",
      protected: "Protected Person（保護対象者）",
      temporary: "一時滞在（就労・留学など）",
      unsure: "不明・要確認",
    },
    quebecHistory: "直近12か月のケベック州居住",
    quebecHistories: {
      twelve_plus: "12か月以上居住している",
      under_twelve: "12か月未満",
      unsure: "不明・要確認",
    },
    collectiveComposition: "コレクティブの構成",
    collectiveCompositions: {
      all: "全員が対象となる在留資格を持つ",
      two_thirds: "3分の2以上が市民または永住者",
      half_qualified: "半数以上がCanada Councilの対象資格を持つ",
      under_half: "対象資格を持つメンバーが半数未満",
      unsure: "不明・要確認",
    },
    collectiveCompositionNote: "2人組の場合、2人とも対象資格を持つときだけ「全員」を選んでください。",
    organizationRegistration: "団体の法的登録状況",
    organizationRegistrations: {
      yes: "カナダで法人化・登録済み",
      no: "カナダで法人化・登録されていない",
      unsure: "不明・要確認",
    },
    profileNote:
      "この試作版が助成機関に代わって可否を決めることはありません。「利用できそう」「条件を満たせば可能」「個別確認が必要」を分けて表示します。",
    callsHeading: "該当する公募",
    callsCount: "件",
    noResults: "このサンプル内に条件と一致する公募がありません。別の活動分野を選んでください。",
    fundingHeading: "資金計画",
    chosen: "選択中の公募",
    officialCall: "公募の公式情報を確認 ↗",
    fundingFor: "関連する助成制度",
    noFunding:
      "直接対応する助成制度を自動表示していません。地元開催の公募や渡航の証明がないコンペに、誤った助成候補を結びつけないためです。",
    officialFunding: "助成制度の公式情報を確認 ↗",
    eligibilityHeading: "申請資格の確認",
    eligibilitySource: "申請資格の公式条件を確認 ↗",
    eligibilityReasons: {
      statusUnknown: "カナダでの在留資格を確認してください。",
      statusNotAccepted: "選択した在留資格は、この制度の対象外です。",
      residencyUnknown: "ケベック州での居住期間を確認してください。",
      residencyTooShort: "この制度は直近12か月のケベック州居住を必要とします。",
      groupUnknown: "コレクティブのメンバー構成を確認してください。",
      groupNotEnough: "対象資格を持つメンバーの割合が制度の基準に達していません。",
      organizationUnknown: "カナダでの法人化・登録状況を確認してください。",
      organizationNotEligible: "カナダで法人化または登録された団体である必要があります。",
    },
    states: {
      possible: "現時点で利用可能性あり",
      conditional: "条件を満たせば可能性あり",
      verify: "個別確認が必要",
      ineligible: "入力条件では対象外",
    },
    coverage: {
      travel: "渡航費",
      stay: "滞在費",
      visa: "査証費",
      transport: "機材運搬費",
      promotion: "広報費",
      market: "市場開拓費",
      touring: "ツアー費",
      fees: "報酬",
      production: "制作費",
      research: "調査費",
      creation: "創作費",
    },
    sourceNote:
      "これは事前確認用の判定です。申請を決める前に、公式ページ、情報の確認日、必要書類を必ず確認してください。",
    verified: "公式情報の確認日",
    languageLabel: "表示言語",
    workflowLabel: "照合の手順",
    matcherLabel: "公募と助成制度の照合",
    eligibleCostsLabel: "対象となる経費",
    whyKicker: "この試作版の目的",
    whyTitle: "一覧は「何があるか」を示す。物差しは「何が足りないか」を示す。",
    whyBody:
      "最終的な根拠は各機関の公式サイトです。MESUREはその一歩手前で、居住地、申請主体、プロジェクト時期をもとに、実在する公募と利用可能性のある助成を結びつけます。",
    rulesKicker: "信頼性のルール",
    rulesTitle: "根拠のない「最適な助成」は表示しません。",
    rules: [
      "国と都市は「国外」のような相対表現ではなく、絶対値で記録します。",
      "招待状、契約書、認定された主催者などの条件を省略せず表示します。",
      "判断に影響する情報には、公式情報へのリンクと確認日を付けます。",
    ],
    footer: "MESURE — Québec · 検証用MVP",
    footerNote: "限定的なサンプルデータです。表示結果は申請資格や採択を保証しません。",
    status: { open: "募集中", rolling: "随時受付", upcoming: "近日開始", closed: "募集終了" },
  },
} as const;

const placeNames: Record<Language, Record<string, string>> = {
  fr: {},
  en: {},
  ja: {
    France: "フランス",
    Paris: "パリ",
    Australia: "オーストラリア",
    Perth: "パース",
    China: "中国",
    Wuzhen: "烏鎮",
    "United States": "アメリカ合衆国",
    Seattle: "シアトル",
    "United Kingdom": "イギリス",
    Leeds: "リーズ",
    Canada: "カナダ",
    Montréal: "モントリオール",
  },
};

const profileOptions: Profile[] = ["artist", "collective", "organization"];
const residenceOptions: Residence[] = ["montreal", "quebec"];
const disciplineOptions: Discipline[] = ["all", "circus", "theatre", "dance", "music"];
const legalStatusOptions: LegalStatus[] = ["unsure", "citizen", "permanent", "protected", "temporary"];
const quebecHistoryOptions: QuebecHistory[] = ["unsure", "twelve_plus", "under_twelve"];
const collectiveCompositionOptions: CollectiveComposition[] = [
  "unsure",
  "all",
  "two_thirds",
  "half_qualified",
  "under_half",
];
const organizationRegistrationOptions: OrganizationRegistration[] = ["unsure", "yes", "no"];

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
  const deadline = new Date(`${opportunity.deadlineDate}T23:59:59`).getTime();
  const remainingDays = (deadline - Date.now()) / 86_400_000;
  return remainingDays >= 0 && remainingDays <= 21;
}

function supportsResidence(funding: Funding, residence: Residence) {
  if (funding.residencies.includes("quebec")) return true;
  return residence === "montreal" && funding.residencies.includes("montreal");
}

export function OpportunityWorkbench() {
  const [language, setLanguage] = useState<Language>("fr");
  const [profile, setProfile] = useState<Profile>("artist");
  const [residence, setResidence] = useState<Residence>("montreal");
  const [discipline, setDiscipline] = useState<Discipline>("all");
  const [legalStatus, setLegalStatus] = useState<LegalStatus>("unsure");
  const [quebecHistory, setQuebecHistory] = useState<QuebecHistory>("unsure");
  const [collectiveComposition, setCollectiveComposition] =
    useState<CollectiveComposition>("unsure");
  const [organizationRegistration, setOrganizationRegistration] =
    useState<OrganizationRegistration>("unsure");
  const [selectedId, setSelectedId] = useState(opportunities[0]?.id ?? "");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr-CA" : language === "en" ? "en-CA" : "ja";
  }, [language]);

  const filteredOpportunities = useMemo(
    () =>
      opportunities
        .filter((opportunity) => opportunity.profiles.includes(profile))
        .filter(
          (opportunity) =>
            discipline === "all" || opportunity.disciplines.includes(discipline),
        )
        .filter((opportunity) => normalizedStatus(opportunity) !== "closed")
        .sort((a, b) => {
          if (!a.deadlineDate) return 1;
          if (!b.deadlineDate) return -1;
          return a.deadlineDate.localeCompare(b.deadlineDate);
        }),
    [discipline, profile],
  );

  const selectedOpportunity =
    filteredOpportunities.find((opportunity) => opportunity.id === selectedId) ??
    filteredOpportunities[0];

  const matches = useMemo(() => {
    if (!selectedOpportunity) return [];
    return selectedOpportunity.fundingMatches.flatMap((match) => {
      const funding = fundingPrograms.find((program) => program.id === match.fundingId);
      if (!funding) return [];
      const profileOk = funding.profiles.includes(profile);
      const residenceOk = supportsResidence(funding, residence);
      const disciplineOk =
        funding.disciplines.includes("all") ||
        selectedOpportunity.disciplines.some((item) =>
          funding.disciplines.includes(item),
        );
      if (!profileOk || !residenceOk || !disciplineOk) return [];
      const assessment = evaluateFundingEligibility({
        funding,
        baseState: match.state,
        profile,
        legalStatus,
        quebecHistory,
        collectiveComposition,
        organizationRegistration,
      }) as { state: MatchState; reasonKeys: EligibilityReasonKey[] };
      return [{ funding, match, assessment }];
    });
  }, [
    collectiveComposition,
    legalStatus,
    organizationRegistration,
    profile,
    quebecHistory,
    residence,
    selectedOpportunity,
  ]);

  return (
    <main className="site-shell">
      <header className="masthead">
        <div className="brandline">
          <h1 className="brand">MESURE</h1>
          <span className="edition">{t.edition}</span>
        </div>
        <div className="language-switch" aria-label={t.languageLabel}>
          {(["fr", "en", "ja"] as Language[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={language === item}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="intro-title">{t.headline}</h2>
        </div>
        <div className="intro-copy">
          <p>{t.intro}</p>
          <span className="data-stamp">{t.stamp}</span>
        </div>
      </section>

      <nav className="steps" aria-label={t.workflowLabel}>
        {t.steps.map((label, index) => (
          <div className="step" key={label}>
            <span className="step-number">0{index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </nav>

      <section className="workbench" aria-label={t.matcherLabel}>
        <aside className="panel panel-profile">
          <div className="panel-heading">
            <span className="section-kicker">01</span>
            <h3>{t.profileHeading}</h3>
          </div>

          <fieldset className="field-group">
            <legend>{t.profile}</legend>
            <div className="choice-stack">
              {profileOptions.map((item) => (
                <button
                  className="choice-button"
                  key={item}
                  type="button"
                  aria-pressed={profile === item}
                  onClick={() => setProfile(item)}
                >
                  <span className="choice-mark" aria-hidden="true">
                    {profile === item ? "×" : ""}
                  </span>
                  <span>{t.profiles[item]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>{t.residence}</legend>
            <div className="choice-stack">
              {residenceOptions.map((item) => (
                <button
                  className="choice-button"
                  key={item}
                  type="button"
                  aria-pressed={residence === item}
                  onClick={() => setResidence(item)}
                >
                  <span className="choice-mark" aria-hidden="true">
                    {residence === item ? "×" : ""}
                  </span>
                  <span>{t.residences[item]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {profile !== "organization" ? (
            <fieldset className="field-group">
              <legend>
                {profile === "collective" ? t.legalStatusCollective : t.legalStatusArtist}
              </legend>
              <select
                className="field-select"
                value={legalStatus}
                onChange={(event) => setLegalStatus(event.target.value as LegalStatus)}
              >
                {legalStatusOptions.map((item) => (
                  <option key={item} value={item}>{t.legalStatuses[item]}</option>
                ))}
              </select>
            </fieldset>
          ) : null}

          {profile === "artist" ? (
            <fieldset className="field-group">
              <legend>{t.quebecHistory}</legend>
              <select
                className="field-select"
                value={quebecHistory}
                onChange={(event) => setQuebecHistory(event.target.value as QuebecHistory)}
              >
                {quebecHistoryOptions.map((item) => (
                  <option key={item} value={item}>{t.quebecHistories[item]}</option>
                ))}
              </select>
            </fieldset>
          ) : null}

          {profile === "collective" ? (
            <fieldset className="field-group">
              <legend>{t.collectiveComposition}</legend>
              <select
                className="field-select"
                value={collectiveComposition}
                onChange={(event) =>
                  setCollectiveComposition(event.target.value as CollectiveComposition)
                }
              >
                {collectiveCompositionOptions.map((item) => (
                  <option key={item} value={item}>{t.collectiveCompositions[item]}</option>
                ))}
              </select>
              <p className="field-note">{t.collectiveCompositionNote}</p>
            </fieldset>
          ) : null}

          {profile === "organization" ? (
            <fieldset className="field-group">
              <legend>{t.organizationRegistration}</legend>
              <select
                className="field-select"
                value={organizationRegistration}
                onChange={(event) =>
                  setOrganizationRegistration(event.target.value as OrganizationRegistration)
                }
              >
                {organizationRegistrationOptions.map((item) => (
                  <option key={item} value={item}>{t.organizationRegistrations[item]}</option>
                ))}
              </select>
            </fieldset>
          ) : null}

          <fieldset className="field-group">
            <legend>{t.discipline}</legend>
            <div className="choice-stack">
              {disciplineOptions.map((item) => (
                <button
                  className="choice-button"
                  key={item}
                  type="button"
                  aria-pressed={discipline === item}
                  onClick={() => setDiscipline(item)}
                >
                  <span className="choice-mark" aria-hidden="true">
                    {discipline === item ? "×" : ""}
                  </span>
                  <span>{t.disciplines[item]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <p className="profile-note">{t.profileNote}</p>
        </aside>

        <section className="panel panel-opportunities">
          <div className="panel-heading">
            <span className="section-kicker">02</span>
            <h3>{t.callsHeading}</h3>
            <span className="data-stamp">
              {filteredOpportunities.length} {t.callsCount}
            </span>
          </div>
          <div className="opportunity-list">
            {filteredOpportunities.length ? (
              filteredOpportunities.map((opportunity) => {
                const status = normalizedStatus(opportunity);
                return (
                  <button
                    className="opportunity-row"
                    type="button"
                    key={opportunity.id}
                    aria-current={selectedOpportunity?.id === opportunity.id}
                    onClick={() => setSelectedId(opportunity.id)}
                  >
                    <span className="row-topline">
                      <span className={`status-tag ${status}`}>{t.status[status]}</span>
                      <span className={`deadline ${isUrgent(opportunity) ? "urgent" : ""}`}>
                        {opportunity.deadlineLabel[language]}
                      </span>
                    </span>
                    <h4>{opportunity.title}</h4>
                    <p className="row-meta">
                      {placeNames[language][opportunity.city] ?? opportunity.city} ·{" "}
                      {placeNames[language][opportunity.country] ?? opportunity.country} ·{" "}
                      {opportunity.organizer}
                    </p>
                  </button>
                );
              })
            ) : (
              <p className="no-results">{t.noResults}</p>
            )}
          </div>
        </section>

        <section className="panel panel-funding" id="funding-panel">
          <div className="panel-heading">
            <span className="section-kicker">03</span>
            <h3>{t.fundingHeading}</h3>
          </div>

          {selectedOpportunity ? (
            <>
              <article className="selected-opportunity">
                <span className="section-kicker">{t.chosen}</span>
                <h4>{selectedOpportunity.title}</h4>
                <p>{selectedOpportunity.summary[language]}</p>
                <ul className="requirement-list">
                  {selectedOpportunity.requirements[language].map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
                <a
                  className="source-link"
                  href={selectedOpportunity.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.officialCall}
                </a>
                <span className="verified-date">{t.verified}: {selectedOpportunity.verifiedAt}</span>
              </article>

              <div className="matches-title">
                <strong>{t.fundingFor}</strong>
                <span className="matches-count">{matches.length}</span>
              </div>

              {matches.length ? (
                <div className="funding-list">
                  {matches.map(({ funding, match, assessment }) => (
                    <article className={`funding-match ${assessment.state}`} key={funding.id}>
                      <span className="match-state">{t.states[assessment.state]}</span>
                      <h5>{funding.name}</h5>
                      <p>{match.note[language]}</p>
                      <div className="eligibility-check">
                        <span className="section-kicker">{t.eligibilityHeading}</span>
                        <p>{funding.eligibility.note[language]}</p>
                        {assessment.reasonKeys.length ? (
                          <ul className="eligibility-reasons">
                            {assessment.reasonKeys.map((reason) => (
                              <li key={reason}>{t.eligibilityReasons[reason]}</li>
                            ))}
                          </ul>
                        ) : null}
                        <a
                          className="eligibility-link"
                          href={funding.eligibility.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.eligibilitySource}
                        </a>
                        <span className="verified-date">
                          {t.verified}: {funding.eligibility.verifiedAt}
                        </span>
                      </div>
                      <div className="coverage" aria-label={t.eligibleCostsLabel}>
                        {funding.coverage.map((item) => (
                          <span key={item}>{t.coverage[item as keyof typeof t.coverage]}</span>
                        ))}
                      </div>
                      <p className="amount-line">{funding.amount[language]}</p>
                      <p>{funding.deadline[language]}</p>
                      <p>{funding.cashflow[language]}</p>
                      <a
                        className="funding-link"
                        href={funding.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.officialFunding}
                      </a>
                      <span className="verified-date">{t.verified}: {funding.verifiedAt}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="no-results">{t.noFunding}</p>
              )}
              <p className="honesty-note">{t.sourceNote}</p>
            </>
          ) : (
            <p className="no-results">{t.noResults}</p>
          )}
        </section>
      </section>

      <div className="below-fold">
        <section>
          <span className="section-kicker">{t.whyKicker}</span>
          <h3>{t.whyTitle}</h3>
          <p>{t.whyBody}</p>
        </section>
        <section>
          <span className="section-kicker">{t.rulesKicker}</span>
          <h3>{t.rulesTitle}</h3>
          <ol className="principles">
            {t.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="footer">
        <strong>{t.footer}</strong>
        <span>{t.footerNote}</span>
      </footer>
    </main>
  );
}
