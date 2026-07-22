import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

function assertISODate(value, label) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/, `${label} must use YYYY-MM-DD`);
  const parsed = new Date(`${value}T00:00:00Z`);
  assert.ok(!Number.isNaN(parsed.getTime()), `${label} must be a real calendar date`);
  assert.equal(parsed.toISOString().slice(0, 10), value, `${label} must be a real calendar date`);
}

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(new URL(pathname, "http://localhost"), { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the MESURE product surface", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>MESURE — Canada/);
  assert.match(html, /Trouvez où votre travail peut aller ensuite/);
  assert.match(html, /pistes d’appels au Canada et à l’international/);
  assert.match(html, /Le financement apparaît ensuite/);
  const workbenchSource = await readFile(new URL("../app/OpportunityWorkbench.tsx", import.meta.url), "utf8");
  assert.match(workbenchSource, /Find where your art could go next/);
  assert.doesNotMatch(workbenchSource, /Find where your work could go next/);
  assert.doesNotMatch(html, /Avant d’envoyer le dossier/);
  assert.match(html, /Où résidez-vous actuellement/);
  assert.match(html, /À propos des informations/);
  assert.match(html, /Ce site est actuellement en version bêta/);
  assert.match(html, /docs\.google\.com\/forms/);
  assert.match(html, /MESURE ne les enregistre pas et ne les transmet pas/);
  assert.match(workbenchSource, /MESURE does not store or transmit them/);
  assert.match(workbenchSource, /MESUREは保存・送信しません/);
  assert.match(html, /Ville de Toronto/);
  assert.match(html, /Ville d’Ottawa/);
  assert.match(html, /Ville de Québec/);
  assert.match(html, /Gatineau/);
  assert.match(html, /Colombie-Britannique/);
  assert.match(html, /Alberta/);
  assert.match(html, /Saskatchewan/);
  assert.match(html, /Manitoba/);
  assert.match(html, /Nouveau-Brunswick/);
  assert.match(html, /Nouvelle-Écosse/);
  assert.match(html, /Île-du-Prince-Édouard/);
  assert.match(html, /Terre-Neuve-et-Labrador/);
  assert.match(html, /Yukon/);
  assert.match(html, /Autres provinces et territoire/);
  assert.doesNotMatch(html, /Festival Mondial du Cirque de Demain/);
  assert.match(html, /Choisissez un appel pour ouvrir sa fiche/);
  assert.doesNotMatch(html, /class="selected-opportunity/);
  assert.doesNotMatch(html, /aria-current="true"/);
  assert.match(html, /Budget autonome à construire/);
  assert.match(html, /Soutien logistique notable/);
  assert.match(html, /Pas une voie directe depuis le Québec/);
  assert.match(html, /aria-label="Affiner les appels"/);
  assert.match(html, /Ouverts maintenant/);
  assert.match(html, /Toutes les régions/);
  assert.match(html, /Tous les accès/);
  assert.match(html, /Tous les niveaux/);
  assert.match(html, /État puis échéance/);
  assert.match(workbenchSource, /data-candidate-kind=\{candidate\.source\}/);
  assert.match(html, /data-candidate-kind="radar"/);
  assert.match(html, /data-radar-candidate-id="idfa-forum-2026"/);
  assert.equal([...html.matchAll(/data-candidate-kind=/g)].length, 8);
  assert.equal([...html.matchAll(/class="candidate-caution"/g)].length, 8);
  assert.match(html, /Point décisif/);
  assert.doesNotMatch(html, /class="candidate-participation"/);
  assert.match(html, /Voir 8 pistes de plus/);
  assert.match(html, /candidate-opportunity-list/);
  assert.match(html, /Candidatures à garder/);
  assert.match(html, /Enregistrez jusqu’à trois appels/);
  assert.equal([...html.matchAll(/class="candidate-save"/g)].length, 8);
  assert.match(workbenchSource, /savedCandidateLimit = 3/);
  assert.match(workbenchSource, /mesure-canada-saved-candidates-v1/);
  assert.match(workbenchSource, /className="candidate-comparison"/);
  assert.match(workbenchSource, /className="action-checklist"/);
  assert.match(workbenchSource, /<details className="regional-programs">/);
  assert.doesNotMatch(workbenchSource, /<details className="regional-programs" open>/);
  assert.match(html, /Termes utilisés sur MESURE/);
  assert.match(html, /Personne protégée/);
  assert.match(html, /Groupe d’artistes sans personne morale distincte/);
  assert.match(html, /Présentation conçue pour obtenir une programmation, une tournée ou des rencontres professionnelles/);
  assert.match(html, /canada\.ca\/en\/services\/immigration-citizenship\/helpcentre\/glossary\.html/);
  assert.match(html, /Heure locale à confirmer/);
  assert.match(workbenchSource, /DeadlineTimeZoneNote/);
  assert.match(html, /Votre statut au Canada/);
  assert.match(html, /href="\/radar"/);
  assert.match(html, /Consulter le registre de veille/);
  assert.doesNotMatch(html, /id="festival-radar-heading"/);
  assert.match(html, /id="funding-panel" tabindex="-1"/);
  assert.match(workbenchSource, /scrollIntoView\(\{ behavior: reduceMotion \? "auto" : "smooth", block: "start" \}\)/);
  assert.equal([...workbenchSource.matchAll(/const \[language, setLanguage\] = usePersistentLanguage\(\);/g)].length, 2);
  assert.match(workbenchSource, /mesure-canada-language/);
  assert.match(workbenchSource, /window\.localStorage\.setItem/);
  assert.match(html, />JA<\/button>/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("server-renders the monitoring ledger on its own route", async () => {
  const response = await render("/radar");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Registre de veille des appels artistiques/);
  assert.match(html, /id="festival-radar-heading"/);
  assert.match(html, /Type d’occasion/);
  assert.match(html, /Appels de festivals régionaux/);
  assert.match(html, /Résidences \/ création sur place/);
  assert.match(html, /Canadian Association of Fringe Festivals — Touring Lottery/);
  assert.match(html, /Contact ontarois 2027/);
  assert.match(html, /TOHU — Résidences de recherche et création/);
  assert.match(html, /UNIMA PASSPORT/);
  assert.match(html, /Practice as Research Residency, Abidjan/);
  assert.match(html, /Le formulaire de candidature 2026 lié par CLATA est maintenant fermé/);
  assert.match(html, /Voir aussi une source officielle complémentaire/);
  assert.match(html, /Pistes fondées sur les critères officiels/);
  assert.match(html, /Vérifié : aucun lien prudent pour l’instant/);
  assert.match(html, /En attente de modalités suffisantes/);
  assert.match(html, /Termes utilisés sur MESURE/);
  assert.match(html, /EEST \(UTC\+3\)/);
  assert.match(html, />JST</);
  assert.match(html, /Heure locale à confirmer/);
  assert.equal([...html.matchAll(/class="radar-row"/g)].length, 166);
  assert.match(html, /Retour à la recherche d’occasions/);
  assert.doesNotMatch(html, /class="workbench"/);
});

test("opportunity and funding records preserve evidence fields", async () => {
  const [opportunitiesText, fundingText, festivalRadarText] = await Promise.all([
    readFile(new URL("data/opportunities.json", root), "utf8"),
    readFile(new URL("data/funding.json", root), "utf8"),
    readFile(new URL("data/festival-radar.json", root), "utf8"),
  ]);
  const opportunities = JSON.parse(opportunitiesText);
  const funding = JSON.parse(fundingText);
  const festivalRadar = JSON.parse(festivalRadarText);
  const fundingIds = new Set(funding.map((record) => record.id));
  const fundingById = new Map(funding.map((record) => [record.id, record]));
  const fundingNames = new Set(funding.map((record) => record.name));

  assert.ok(opportunities.length >= 6);
  assert.ok(funding.length >= 41);
  assert.ok(fundingNames.has("En Piste — Remboursement des dépenses d’entraînement"));
  assert.ok(fundingNames.has("En Piste — Formation individualisée / sur mesure"));
  assert.ok(fundingNames.has("En Piste — Mon premier RIDEAU"));
  assert.ok(fundingNames.has("BC Arts Council — Arts Circulation and Touring (Individuals)"));
  assert.ok(fundingNames.has("Alberta Foundation for the Arts — Theatre Individual Project Funding"));
  assert.ok(fundingNames.has("SK Arts — Independent Artists"));
  assert.ok(fundingNames.has("Manitoba Arts Council — Create"));
  assert.ok(fundingNames.has("artsnb — Artist in Residence (Artists)"));
  assert.ok(fundingNames.has("Arts Nova Scotia — Grants to Individuals"));
  assert.ok(fundingNames.has("PEI Arts Grants — Share"));
  assert.ok(fundingNames.has("ArtsNL — Professional Artists’ Travel Fund"));
  assert.ok(fundingNames.has("Yukon — Touring Artist Fund"));
  assert.equal(new Set(opportunities.map((record) => record.id)).size, opportunities.length, "Duplicate opportunity id");
  assert.equal(new Set(funding.map((record) => record.id)).size, funding.length, "Duplicate funding id");
  for (const record of opportunities) {
    assert.ok(record.country && record.city);
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assert.ok(!String(record.country).includes("海外"));
    assert.ok(record.deadlineLabel.ja);
    if (record.deadlineTimeZone) {
      assert.ok(record.deadlineDate, `${record.id}.deadlineTimeZone requires deadlineDate`);
      assert.ok(typeof record.deadlineTimeZone === "string", `${record.id}.deadlineTimeZone`);
    }
    assert.ok(record.summary.ja);
    assert.ok(record.requirements.ja.length > 0);
    assert.ok(["supported", "conditional", "self_funded", "verify", "not_direct"].includes(record.decisionGuide.quebecAssessment.state));
    for (const language of ["fr", "en", "ja"]) {
      assert.ok(record.decisionGuide.access[language], `${record.id}.decisionGuide.access.${language}`);
      assert.ok(record.decisionGuide.applicantCost[language], `${record.id}.decisionGuide.applicantCost.${language}`);
      assert.ok(record.decisionGuide.organizerSupport[language], `${record.id}.decisionGuide.organizerSupport.${language}`);
      assert.ok(record.decisionGuide.quebecAssessment.note[language], `${record.id}.decisionGuide.quebecAssessment.note.${language}`);
    }
    for (const match of record.fundingMatches) {
      assert.ok(fundingIds.has(match.fundingId), `Missing funding record: ${match.fundingId}`);
      assert.ok(["possible", "conditional", "verify"].includes(match.state));
      assert.ok(match.note.ja);
      const linkedFunding = fundingById.get(match.fundingId);
      assert.ok(
        record.profiles.some((profile) => linkedFunding.profiles.includes(profile)),
        `No compatible applicant profile: ${record.id} -> ${match.fundingId}`,
      );
    }
  }

  const opportunityById = new Map(opportunities.map((record) => [record.id, record]));
  const featuredOpportunityIds = [
    "cirque-de-demain-2027",
    "fringe-world-perth-2027",
    "wuzhen-emerging-2026",
    "wjf-23-seattle",
    "leeds-piano-2027",
    "cmim-piano-2027",
  ];
  for (const id of featuredOpportunityIds) {
    assert.equal(opportunityById.get(id)?.verifiedAt, "2026-07-22", `${id} must use the latest featured-call audit`);
  }

  const fringeWorld = opportunityById.get("fringe-world-perth-2027");
  assert.equal(fringeWorld.status, "open");
  assert.equal(fringeWorld.deadlineDate, "2026-10-07");
  assert.match(fringeWorld.summary.ja, /175豪ドル/);
  assert.match(fringeWorld.requirements.ja.join(" "), /32％/);
  assert.equal(fringeWorld.decisionGuide.quebecAssessment.state, "self_funded");

  const wuzhen = opportunityById.get("wuzhen-emerging-2026");
  assert.match(wuzhen.summary.ja, /応募無料/);
  assert.match(wuzhen.summary.ja, /片道あたり4,000元/);
  assert.match(wuzhen.requirements.ja.join(" "), /国籍不問/);
  assert.equal(wuzhen.decisionGuide.quebecAssessment.state, "supported");
  assert.match(wuzhen.decisionGuide.organizerSupport.ja, /最大5人分/);

  const leeds = opportunityById.get("leeds-piano-2027");
  assert.match(leeds.deadlineLabel.ja, /11月7日/);
  assert.doesNotMatch(leeds.deadlineLabel.ja, /9月30日/);
  assert.match(leeds.summary.ja, /第1ラウンド.*自己負担/);
  assert.equal(leeds.decisionGuide.quebecAssessment.state, "conditional");

  const cmim = opportunityById.get("cmim-piano-2027");
  assert.match(cmim.summary.ja, /200カナダドル/);
  assert.match(cmim.summary.ja, /往復エコノミー航空券または同等の交通手段/);
  assert.match(cmim.summary.ja, /無料宿泊/);
  assert.equal(cmim.decisionGuide.quebecAssessment.state, "supported");
  assert.match(cmim.decisionGuide.quebecAssessment.note.ja, /同等交通/);
  assert.equal(cmim.deadlineTimeZone, "EDT (Montréal)");

  for (const record of funding) {
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assert.ok(record.profiles.length > 0);
    assert.ok(record.residencies.length > 0);
    assert.ok(record.residencies.every((scope) =>
      ["canada", "quebec", "quebec_city", "montreal", "ontario", "gta", "toronto", "ottawa", "british_columbia", "alberta", "saskatchewan", "manitoba", "new_brunswick", "nova_scotia", "prince_edward_island", "newfoundland_labrador", "yukon"].includes(scope)
    ));
    assert.ok(["mobility_export", "home_base_creation", "career_support"].includes(record.purpose));
    assert.ok(["grant", "paid_program"].includes(record.kind));
    for (const language of ["fr", "en", "ja"]) {
      assert.ok(record.deadline[language], `${record.id}.deadline.${language}`);
      assert.ok(record.amount[language], `${record.id}.amount.${language}`);
      assert.ok(record.cashflow[language], `${record.id}.cashflow.${language}`);
    }
    assert.ok(record.eligibility);
    assert.ok(record.eligibility.note.fr);
    assert.ok(record.eligibility.note.en);
    assert.ok(record.eligibility.note.ja);
    assert.ok(/^https?:\/\//.test(record.eligibility.sourceUrl));
    assertISODate(record.eligibility.verifiedAt, `${record.id}.eligibility.verifiedAt`);
  }

  assert.ok(festivalRadar.length >= 166);
  assert.equal(new Set(festivalRadar.map((record) => record.id)).size, festivalRadar.length, "Duplicate festival radar id");
  const normalizeRouteKey = (value) => value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\p{P}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const routeKeys = festivalRadar.map((record) => `${normalizeRouteKey(record.title)}|${normalizeRouteKey(record.city)}`);
  assert.equal(new Set(routeKeys).size, routeKeys.length, "Duplicate normalized festival title and city");

  const sourceOwners = new Map();
  for (const record of festivalRadar) {
    sourceOwners.set(record.sourceUrl, [...(sourceOwners.get(record.sourceUrl) ?? []), record.id]);
    if (record.networkSourceUrl) {
      assert.ok(/^https?:\/\//.test(record.networkSourceUrl), `${record.id}.networkSourceUrl`);
      assert.notEqual(record.networkSourceUrl, record.sourceUrl, `${record.id} repeats its primary source`);
    }
  }
  const allowedSharedSources = new Set([
    "https://marionnette.com/app/uploads/2026/03/appel-a-candidatures-residences-2026-2027_engl.pdf",
  ]);
  for (const [sourceUrl, ids] of sourceOwners) {
    if (ids.length > 1) {
      assert.ok(allowedSharedSources.has(sourceUrl), `Unexpected shared festival source: ${sourceUrl} (${ids.join(", ")})`);
    }
  }
  assert.deepEqual(new Set(festivalRadar.map((record) => record.family)), new Set(["circus", "street", "fringe", "film", "showcase"]));
  assert.ok(new Set(festivalRadar.map((record) => record.region)).size >= 6);
  assert.ok(festivalRadar.filter((record) => record.family === "circus").length >= 22);
  assert.ok(festivalRadar.filter((record) => record.family === "street").length >= 9);
  assert.ok(festivalRadar.filter((record) => record.family === "fringe").length >= 40);
  assert.ok(festivalRadar.filter((record) => record.family === "showcase").length >= 13);
  assert.ok(festivalRadar.some((record) => record.id === "caff-touring-lottery-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "bnfn-artist-call-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "contact-ontarois-2027-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "roseq-seasonal-2027-28"));
  assert.ok(festivalRadar.some((record) => record.id === "micc-tour-de-piste-2026-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "tohu-research-creation-residencies-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "valspec-circus-residency-2026-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "contact-ouest-repertoire-2027-28"));
  assert.ok(festivalRadar.some((record) => record.id === "francofete-acadie-2027-28"));
  assert.ok(festivalRadar.some((record) => record.id === "edmonton-fringe-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "prague-fringe-2027"));
  assert.ok(festivalRadar.some((record) => record.id === "bergen-fringe-2027"));
  assert.ok(festivalRadar.some((record) => record.id === "dynamo-circus-residency-2027-28"));
  assert.ok(festivalRadar.some((record) => record.id === "fringemtl-2027-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "osac-showcase-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "contact-east-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "pacific-contact-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "national-folk-festival-2028-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "out-there-supported-residency-open"));
  assert.ok(festivalRadar.some((record) => record.id === "guelph-fringe-2027-watch"));
  assert.equal(festivalRadar.find((record) => record.id === "porec-street-art-2026").status, "watch");
  assert.equal(festivalRadar.find((record) => record.id === "guelph-fringe-2027-watch").deadlineDate, "2026-02-22");
  assert.equal(festivalRadar.find((record) => record.id === "yukon-fringe-watch").deadlineDate, "2026-04-10");
  assert.match(festivalRadar.find((record) => record.id === "caff-touring-lottery-watch").deadlineLabel.ja, /居住|住所/);
  assert.ok(festivalRadar.some((record) => record.id === "fundy-fringe-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "nogojiwanong-indigenous-fringe-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "mostra-igualada-2027-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "cubadupa-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "sixfest-plovdiv-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "ceara-international-circus-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "world-buskers-festival-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "buskers-bern-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "nelson-fringe-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "new-zealand-fringe-2027-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "dublin-fringe-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "masa-festival-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "gwangju-busking-worldcup-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "busan-magic-busking-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "aoca-africa-circus-partner-route-2027"));
  assert.ok(festivalRadar.some((record) => record.id === "santiago-off-international-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "londrina-circus-festival-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "jerusalem-solo-dance-circus-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "beirut-choreography-encounters-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "buffer-fringe-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "south-africa-national-arts-fringe-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "uct-ica-live-art-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "irish-aerial-wild-card-residency-open"));
  assert.ok(festivalRadar.some((record) => record.id === "cirko-w-coproduction-2028-regional"));
  assert.ok(festivalRadar.some((record) => record.id === "feten-gijon-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "carthage-theatre-days-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "kyoto-art-center-performing-arts-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "inaf-norway-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "art-explora-paris-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "cnd-cite-choreographer-residency-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "art-explora-vila31-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "festilambe-valparaiso-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "zirkushalle-dornbirn-residency-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "le-plongeoir-circus-residency-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "pflasterspektakel-linz-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "chalon-dans-la-rue-off-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "villa-albertine-performing-street-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "directors-in-tya-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "saison-visiting-fellows-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "kinosaki-performing-arts-air-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "tokas-international-performance-art-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "goyang-street-arts-global-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "newcastle-puppetry-festival-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "immagina-rome-puppetry-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "aviama-puppets-mobility-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "iida-puppet-international-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "dance-now-asia-showcase-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "subotica-childrens-theatre-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "flum-mostar-puppetry-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "banja-luka-childrens-theatre-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "novi-sad-theatre-festival-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "solostage-krakow-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "puppet-fair-sofia-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "bielsko-puppetry-art-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "destinos-chicago-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "unima-passport-prelet-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "fiams-saguenay-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "smethwick-puppetry-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "jskd-cankarjeva-puppetry-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "fmtm-programming-route-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "pole-marionnette-documentary-residency-open"));
  assert.ok(festivalRadar.some((record) => record.id === "calendureta-2027-upcoming"));
  assert.ok(festivalRadar.some((record) => record.id === "toyooka-fringe-selection-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "air-taipei-puppetry-2027-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "lize-puppet-residency-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "pole-marionnette-creation-residency-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "titirimadrono-next-watch"));
  assert.ok(!festivalRadar.some((record) => record.id === "beverley-puppet-next-watch"));
  assert.ok(!festivalRadar.some((record) => record.id === "fort-mcmurray-fringe-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "arab-theatre-festival-2027-open"));
  assert.ok(festivalRadar.some((record) => record.id === "unima-abidjan-practice-research-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "pesta-boneka-puppet-camp-2026-open"));
  assert.ok(festivalRadar.some((record) => record.id === "eazees-womens-theatre-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "cairo-experimental-theatre-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "physical-festival-chicago-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "puppet-fringe-nyc-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "fitu-unam-international-next-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "faot-alamos-performing-arts-next-watch"));
  for (const record of festivalRadar) {
    assert.ok(record.title && record.country && record.city);
    assert.ok(["circus", "street", "fringe", "film", "showcase"].includes(record.family));
    assert.ok(["international", "open_access", "selection", "regional_conditions", "language_conditions", "eligibility_check"].includes(record.participation));
    assert.ok(["open", "upcoming", "watch"].includes(record.status));
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assertISODate(record.nextCheckDate, `${record.id}.nextCheckDate`);
    assert.ok(record.nextCheckDate >= record.verifiedAt, `${record.id}.nextCheckDate predates verification`);
    if (record.deadlineDate) {
      assertISODate(record.deadlineDate, `${record.id}.deadlineDate`);
      if (record.status === "open") {
        assert.ok(record.deadlineDate >= new Date().toISOString().slice(0, 10), `${record.id} is marked open after its deadline`);
      }
    }
    if (record.deadlineTimeZone) {
      assert.ok(record.deadlineDate, `${record.id}.deadlineTimeZone requires deadlineDate`);
      assert.ok(typeof record.deadlineTimeZone === "string", `${record.id}.deadlineTimeZone`);
    }
    if (["open", "upcoming"].includes(record.status) && record.deadlineDate && record.nextCheckDate) {
      assert.ok(record.nextCheckDate <= record.deadlineDate, `${record.id}.nextCheckDate must not fall after its deadline`);
    }
    for (const language of ["fr", "en", "ja"]) {
      assert.ok(record.deadlineLabel[language], `${record.id}.deadlineLabel.${language}`);
    }
    if (record.linkedOpportunityId) {
      assert.ok(opportunities.some((opportunity) => opportunity.id === record.linkedOpportunityId), `${record.id}.linkedOpportunityId`);
    }
    if (record.decisionGuide) {
      assert.ok(["supported", "conditional", "self_funded", "verify", "not_direct"].includes(record.decisionGuide.quebecAssessment.state));
      for (const language of ["fr", "en", "ja"]) {
        assert.ok(record.decisionGuide.access[language], `${record.id}.decisionGuide.access.${language}`);
        assert.ok(record.decisionGuide.applicantCost[language], `${record.id}.decisionGuide.applicantCost.${language}`);
        assert.ok(record.decisionGuide.organizerSupport[language], `${record.id}.decisionGuide.organizerSupport.${language}`);
        assert.ok(record.decisionGuide.quebecAssessment.note[language], `${record.id}.decisionGuide.quebecAssessment.note.${language}`);
      }
    }
    if (record.fundingReview) {
      assert.ok(["suggested", "reviewed_no_match", "pending_terms"].includes(record.fundingReview.status));
      assertISODate(record.fundingReview.verifiedAt, `${record.id}.fundingReview.verifiedAt`);
      assert.ok(record.fundingReview.verifiedAt >= record.verifiedAt, `${record.id}.fundingReview predates route verification`);
      for (const language of ["fr", "en", "ja"]) {
        assert.ok(record.fundingReview.note[language], `${record.id}.fundingReview.note.${language}`);
      }
      if (record.fundingReview.status === "suggested") {
        assert.ok(record.fundingReview.fundingMatches.length > 0, `${record.id} needs at least one reviewed funding lead`);
      } else {
        assert.equal(record.fundingReview.fundingMatches.length, 0, `${record.id} must not link funding without sufficient evidence`);
      }
      for (const match of record.fundingReview.fundingMatches) {
        assert.ok(fundingIds.has(match.fundingId), `Missing radar funding record: ${record.id} -> ${match.fundingId}`);
        assert.ok(["possible", "conditional", "verify"].includes(match.state));
        for (const language of ["fr", "en", "ja"]) {
          assert.ok(match.note[language], `${record.id}.${match.fundingId}.note.${language}`);
        }
      }
    }
  }

  const festivalRadarById = new Map(festivalRadar.map((record) => [record.id, record]));
  assert.equal(festivalRadarById.get("cirko-w-coproduction-2028-regional")?.deadlineTimeZone, "EEST (UTC+3)");
  assert.equal(festivalRadarById.get("kyoto-art-center-performing-arts-2027-open")?.deadlineTimeZone, "JST");
  assert.equal(festivalRadarById.get("fifdh-2027")?.deadlineTimeZone, "CET (as published)");
  assert.equal(festivalRadarById.get("sxsw-film-2027")?.deadlineTimeZone, "CT");
  assert.equal(festivalRadarById.get("sundance-film-2027")?.deadlineTimeZone, "PST (as published)");
  assert.equal(festivalRadarById.get("iffr-2027")?.deadlineTimeZone, "CEST");
  assert.equal(festivalRadarById.get("prague-fringe-2027")?.deadlineTimeZone, "HST (as published)");

  const radarDecisionGuideIds = [
    "idfa-forum-2026",
    "jskd-cankarjeva-puppetry-2026-open",
    "sxsw-film-2027",
    "fifdh-2027",
    "feten-gijon-2027-open",
    "imaginarius-2027",
    "carthage-theatre-days-2026-open",
    "circusstad-circunstruction-15",
    "contact-ouest-repertoire-2027-28",
    "kyoto-art-center-performing-arts-2027-open",
    "smethwick-puppetry-2027-open",
    "solostage-krakow-2026-open",
    "adelaide-fringe-2027",
    "cairo-film-2026",
    "cubadupa-2027-open",
    "rideau-showcase-watch",
    "prague-fringe-2027",
    "nelson-fringe-2027-upcoming",
    "new-zealand-fringe-2027-watch",
    "cirko-w-coproduction-2028-regional",
    "guadalajara-film-2027",
    "bergen-fringe-2027",
    "inaf-norway-2027-open",
    "francofete-acadie-2027-28",
    "unima-abidjan-practice-research-2026-open",
    "ypam-fringe-2027",
    "cirque-de-demain-2027",
    "edinburgh-fringe-2026",
    "sundance-film-2027",
    "iffr-2027",
    "brooklyn-film-2027",
    "idfa-docs-for-sale-2026",
    "cinars-off-2026",
    "tallinn-fringe-2026-open",
    "dynamo-circus-residency-2027-28",
    "out-there-supported-residency-open",
    "world-buskers-festival-2027-open",
    "aoca-africa-circus-partner-route-2027",
    "irish-aerial-wild-card-residency-open",
    "directors-in-tya-2027-open",
    "novi-sad-theatre-festival-2027-open",
    "fiams-saguenay-2027-open",
    "fmtm-programming-route-2027-open",
    "pole-marionnette-documentary-residency-open",
    "arab-theatre-festival-2027-open",
    "unima-passport-prelet-2026-open",
    "pesta-boneka-puppet-camp-2026-open",
    "lize-puppet-residency-next-watch",
  ];
  assert.equal(festivalRadar.filter((record) => record.decisionGuide).length, radarDecisionGuideIds.length);
  assert.equal(festivalRadar.filter((record) => record.status === "open" && !record.decisionGuide).length, 0, "Every open radar record must expose a practical decision guide");
  for (const id of radarDecisionGuideIds) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.ok(record?.decisionGuide, `${id} must expose a practical decision guide`);
    assert.equal(record.verifiedAt, "2026-07-22", `${id} decision guide must use the current source audit`);
  }
  assert.equal(festivalRadar.find((record) => record.id === "circusstad-circunstruction-15").decisionGuide.quebecAssessment.state, "not_direct");
  assert.equal(festivalRadar.find((record) => record.id === "imaginarius-2027").decisionGuide.quebecAssessment.state, "supported");
  assert.equal(festivalRadar.find((record) => record.id === "idfa-forum-2026").decisionGuide.quebecAssessment.state, "self_funded");
  assert.match(festivalRadar.find((record) => record.id === "idfa-forum-2026").decisionGuide.applicantCost.ja, /475ユーロ/);
  assert.equal(festivalRadar.find((record) => record.id === "sxsw-film-2027").decisionGuide.quebecAssessment.state, "self_funded");
  assert.match(festivalRadar.find((record) => record.id === "sxsw-film-2027").decisionGuide.applicantCost.ja, /125／90米ドル/);
  assert.equal(festivalRadar.find((record) => record.id === "fifdh-2027").decisionGuide.quebecAssessment.state, "conditional");
  assert.match(festivalRadar.find((record) => record.id === "fifdh-2027").decisionGuide.applicantCost.ja, /200スイスフラン/);
  assert.equal(festivalRadar.find((record) => record.id === "solostage-krakow-2026-open").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "cairo-film-2026").decisionGuide.quebecAssessment.state, "verify");
  assert.equal(festivalRadar.find((record) => record.id === "cubadupa-2027-open").decisionGuide.quebecAssessment.state, "verify");
  assert.equal(festivalRadar.find((record) => record.id === "adelaide-fringe-2027").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "rideau-showcase-watch").decisionGuide.quebecAssessment.state, "verify");
  assert.equal(festivalRadar.find((record) => record.id === "prague-fringe-2027").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "nelson-fringe-2027-upcoming").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "new-zealand-fringe-2027-watch").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "cirko-w-coproduction-2028-regional").decisionGuide.quebecAssessment.state, "not_direct");
  assert.equal(festivalRadar.find((record) => record.id === "guadalajara-film-2027").decisionGuide.quebecAssessment.state, "verify");
  assert.equal(festivalRadar.find((record) => record.id === "bergen-fringe-2027").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "inaf-norway-2027-open").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "francofete-acadie-2027-28").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "unima-abidjan-practice-research-2026-open").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "ypam-fringe-2027").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "cirque-de-demain-2027").decisionGuide.quebecAssessment.state, "verify");
  assert.equal(festivalRadar.find((record) => record.id === "edinburgh-fringe-2026").decisionGuide.quebecAssessment.state, "self_funded");
  assert.equal(festivalRadar.find((record) => record.id === "idfa-docs-for-sale-2026").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "dynamo-circus-residency-2027-28").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "aoca-africa-circus-partner-route-2027").decisionGuide.quebecAssessment.state, "not_direct");
  assert.equal(festivalRadar.find((record) => record.id === "arab-theatre-festival-2027-open").decisionGuide.quebecAssessment.state, "supported");
  assert.equal(festivalRadar.find((record) => record.id === "pesta-boneka-puppet-camp-2026-open").decisionGuide.quebecAssessment.state, "not_direct");
  assert.equal(festivalRadar.find((record) => record.id === "world-buskers-festival-2027-open").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "fiams-saguenay-2027-open").decisionGuide.quebecAssessment.state, "conditional");
  assert.equal(festivalRadar.find((record) => record.id === "lize-puppet-residency-next-watch").decisionGuide.quebecAssessment.state, "not_direct");
  assert.match(festivalRadar.find((record) => record.id === "pesta-boneka-puppet-camp-2026-open").decisionGuide.applicantCost.ja, /1,200米ドル/);
  assert.match(festivalRadar.find((record) => record.id === "ypam-fringe-2027").decisionGuide.applicantCost.ja, /18,700〜38,500円/);
  assert.match(festivalRadar.find((record) => record.id === "guadalajara-film-2027").decisionGuide.applicantCost.ja, /応募は無料/);
  assert.match(festivalRadar.find((record) => record.id === "francofete-acadie-2027-28").decisionGuide.applicantCost.ja, /100カナダドル/);
  assert.match(festivalRadar.find((record) => record.id === "edinburgh-fringe-2026").decisionGuide.applicantCost.ja, /96ポンド/);
  assert.match(festivalRadar.find((record) => record.id === "sundance-film-2027").decisionGuide.applicantCost.ja, /55〜95米ドル/);
  assert.match(festivalRadar.find((record) => record.id === "idfa-docs-for-sale-2026").decisionGuide.applicantCost.ja, /210ユーロ/);
  assert.match(festivalRadar.find((record) => record.id === "pole-marionnette-documentary-residency-open").decisionGuide.applicantCost.ja, /助成金はありません/);
  assert.match(festivalRadar.find((record) => record.id === "adelaide-fringe-2027").deadlineLabel.ja, /9月8日/);
  assert.match(festivalRadar.find((record) => record.id === "adelaide-fringe-2027").deadlineLabel.ja, /8月10日/);
  assert.equal(festivalRadar.find((record) => record.id === "rideau-showcase-watch").deadlineDate, "2026-09-17");
  assert.equal(festivalRadar.find((record) => record.id === "world-buskers-festival-2027-open").deadlineDate, "2026-08-31");
  assert.match(festivalRadar.find((record) => record.id === "world-buskers-festival-2027-open").decisionGuide.organizerSupport.ja, /渡航支援/);
  assert.match(festivalRadar.find((record) => record.id === "nelson-fringe-2027-upcoming").decisionGuide.applicantCost.ja, /50ニュージーランドドル/);
  assert.match(festivalRadar.find((record) => record.id === "nelson-fringe-2027-upcoming").decisionGuide.applicantCost.ja, /60％/);
  assert.match(festivalRadar.find((record) => record.id === "new-zealand-fringe-2027-watch").decisionGuide.applicantCost.ja, /2026年/);
  assert.match(festivalRadar.find((record) => record.id === "fiams-saguenay-2027-open").decisionGuide.organizerSupport.ja, /出演料交渉/);
  assert.equal(festivalRadar.find((record) => record.id === "iffr-2027").nextCheckDate, "2026-08-07");

  const firstCircusFundingBatch = [
    "cirque-de-demain-2027",
    "circusstad-circunstruction-15",
    "circa-residencies-2027-28",
    "dynamo-circus-residency-2027-28",
    "out-there-supported-residency-open",
    "irish-aerial-wild-card-residency-open",
    "cirko-w-coproduction-2028-regional",
    "feten-gijon-2027-open",
  ].map((id) => festivalRadar.find((record) => record.id === id));
  assert.ok(firstCircusFundingBatch.every(Boolean));
  assert.ok(firstCircusFundingBatch.every((record) => record.linkedOpportunityId || record.fundingReview));
  assert.equal(festivalRadar.find((record) => record.id === "cirque-de-demain-2027").linkedOpportunityId, "cirque-de-demain-2027");
  assert.equal(festivalRadar.find((record) => record.id === "feten-gijon-2027-open").fundingReview.fundingMatches.length, 2);
  for (const id of [
    "circusstad-circunstruction-15",
    "imaginarius-2027",
    "fifdh-2027",
    "cairo-film-2026",
    "idfa-forum-2026",
    "feten-gijon-2027-open",
  ]) {
    assert.equal(festivalRadar.find((record) => record.id === id).verifiedAt, "2026-07-22", `${id} should retain the deadline audit date`);
  }
  const wjf = opportunities.find((record) => record.id === "wjf-23-seattle");
  assert.equal(wjf.verifiedAt, "2026-07-22");
  assert.match(wjf.deadlineLabel.ja, /250米ドルの登録期間最終日/);
  assert.match(wjf.deadlineLabel.ja, /登録可能/);

  const secondFundingBatch = [
    ["jskd-cankarjeva-puppetry-2026-open", 1],
    ["imaginarius-2027", 2],
    ["solostage-krakow-2026-open", 2],
  ];
  for (const [id, expectedMatches] of secondFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, "suggested", `${id} should expose reviewed leads`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }

  const thirdFundingBatch = new Map([
    ["contact-ouest-repertoire-2027-28", ["reviewed_no_match", 0]],
    ["bergen-fringe-2027", ["suggested", 2]],
    ["cubadupa-2027-open", ["pending_terms", 0]],
  ]);
  for (const [id, [expectedStatus, expectedMatches]] of thirdFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, expectedStatus, `${id} funding review status`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }

  const fourthFundingBatch = new Map([
    ["carthage-theatre-days-2026-open", ["suggested", 2]],
    ["kyoto-art-center-performing-arts-2027-open", ["suggested", 1]],
    ["ypam-fringe-2027", ["suggested", 1]],
  ]);
  for (const [id, [expectedStatus, expectedMatches]] of fourthFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, expectedStatus, `${id} funding review status`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "carthage-theatre-days-2026-open").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["calq-circulation", "cca-microgrants"],
  );
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "kyoto-art-center-performing-arts-2027-open").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["cca-residencies"],
  );

  const fifthFundingBatch = new Map([
    ["inaf-norway-2027-open", ["suggested", 2]],
    ["unima-passport-prelet-2026-open", ["pending_terms", 0]],
    ["smethwick-puppetry-2027-open", ["pending_terms", 0]],
  ]);
  for (const [id, [expectedStatus, expectedMatches]] of fifthFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, expectedStatus, `${id} funding review status`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }
  const unimaPassport = festivalRadar.find((record) => record.id === "unima-passport-prelet-2026-open");
  assert.equal(unimaPassport.status, "open");
  assert.equal(unimaPassport.deadlineDate, "2026-08-04");
  assert.match(unimaPassport.deadlineLabel.ja, /1枠/);
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "inaf-norway-2027-open").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["calq-circulation", "cca-microgrants"],
  );

  const sixthFundingBatch = new Map([
    ["idfa-forum-2026", ["pending_terms", 0]],
    ["sxsw-film-2027", ["pending_terms", 0]],
    ["fifdh-2027", ["suggested", 1]],
    ["pesta-boneka-puppet-camp-2026-open", ["reviewed_no_match", 0]],
  ]);
  for (const [id, [expectedStatus, expectedMatches]] of sixthFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, expectedStatus, `${id} funding review status`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "fifdh-2027").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["cca-microgrants"],
  );

  const seventhFundingBatch = new Map([
    ["adelaide-fringe-2027", ["suggested", 1]],
    ["sundance-film-2027", ["pending_terms", 0]],
    ["iffr-2027", ["pending_terms", 0]],
    ["cairo-film-2026", ["pending_terms", 0]],
    ["rideau-showcase-watch", ["pending_terms", 0]],
    ["prague-fringe-2027", ["suggested", 2]],
    ["cubadupa-2027-open", ["pending_terms", 0]],
    ["world-buskers-festival-2027-open", ["suggested", 1]],
    ["nelson-fringe-2027-upcoming", ["suggested", 2]],
    ["new-zealand-fringe-2027-watch", ["pending_terms", 0]],
    ["cirko-w-coproduction-2028-regional", ["reviewed_no_match", 0]],
    ["fiams-saguenay-2027-open", ["pending_terms", 0]],
    ["lize-puppet-residency-next-watch", ["reviewed_no_match", 0]],
  ]);
  for (const [id, [expectedStatus, expectedMatches]] of seventhFundingBatch) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.fundingReview.status, expectedStatus, `${id} funding review status`);
    assert.equal(record.fundingReview.fundingMatches.length, expectedMatches, `${id} reviewed lead count`);
  }
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "adelaide-fringe-2027").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["cca-microgrants"],
  );
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "prague-fringe-2027").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["calq-circulation", "cca-microgrants"],
  );
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "world-buskers-festival-2027-open").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["calq-circulation"],
  );
  assert.deepEqual(
    festivalRadar.find((record) => record.id === "nelson-fringe-2027-upcoming").fundingReview.fundingMatches.map((match) => match.fundingId),
    ["calq-circulation", "cca-microgrants"],
  );
  const pestaBoneka = festivalRadar.find((record) => record.id === "pesta-boneka-puppet-camp-2026-open");
  assert.equal(pestaBoneka.status, "watch");
  assert.equal(pestaBoneka.networkSourceUrl, "https://bit.ly/shanksmare");

  const destinos = festivalRadar.find((record) => record.id === "destinos-chicago-2026-open");
  assert.equal(destinos.status, "watch");
  assert.equal(destinos.sourceUrl, "https://forms.gle/D2i4p9ndywn231qW7");
  assert.equal(destinos.networkSourceUrl, "https://www.clata.org/en/");
  const carthage = festivalRadar.find((record) => record.id === "carthage-theatre-days-2026-open");
  assert.equal(carthage.networkSourceUrl, "https://jtcarthage.tn/");
  const iffr = festivalRadar.find((record) => record.id === "iffr-2027");
  assert.equal(iffr.status, "open");
  assert.equal(iffr.sourceUrl, "https://iffr.com/en/iffr-pro-submissions/film-entry");
  assert.equal(iffr.networkSourceUrl, "https://iffr.com/en/frequently-asked-questions/professionals-faq/film-entry-submission-materials");
  const carthageAccessFallback = festivalRadar.find((record) => record.id === "carthage-theatre-days-2026-open");
  assert.equal(carthageAccessFallback.networkSourceUrl, "https://jtcarthage.tn/");
  const faot = festivalRadar.find((record) => record.id === "faot-alamos-performing-arts-next-watch");
  assert.equal(faot.networkSourceUrl, "https://isc.sonora.gob.mx/acciones/actividades/convoca-gobierno-de-sonora-a-artistas-para-formar-parte-del-faot-2027");
  const uctLiveArt = festivalRadar.find((record) => record.id === "uct-ica-live-art-next-watch");
  assert.equal(uctLiveArt.networkSourceUrl, "https://humanities.uct.ac.za/ica/projects/ica-live-art-festival");
  assert.equal(uctLiveArt.verifiedAt, "2026-07-22");

  const repairedWatchSources = new Map([
    ["cinars-biennale-2026-official-watch", ["https://cinars.org/en/call-for-applications", "https://cinars.org/en/about-the-biennale"]],
    ["en-piste-mentorat-pancanadien-2026-watch", ["https://enpiste.qc.ca/appel-de-candidature-projet-de-mentorat-pancanadien/", undefined]],
    ["chalon-dans-la-rue-off-next-watch", ["https://www.chalondanslarue.com/uploads/documents/Documents%20Compagnies/2026_Cahier_des_charges_SO.pdf", "https://www.chalondanslarue.com/"]],
    ["subotica-childrens-theatre-next-watch", ["https://lutfestsubotica.net/uploads/documents/20251110/document_571264669.doc", "https://www.lutfestsubotica.net/"]],
  ]);
  for (const [id, [sourceUrl, networkSourceUrl]] of repairedWatchSources) {
    const record = festivalRadar.find((item) => item.id === id);
    assert.equal(record.status, "watch", `${id} remains a monitoring record`);
    assert.equal(record.sourceUrl, sourceUrl, `${id} primary source`);
    assert.equal(record.networkSourceUrl, networkSourceUrl, `${id} official fallback`);
    assert.equal(record.verifiedAt, "2026-07-22", `${id} verification date`);
  }

  assert.equal(
    festivalRadar.filter((record) => record.participation === "eligibility_check").length,
    0,
    "every retained radar entry must be classified from its primary-source evidence",
  );
  assert.equal(
    festivalRadar.find((record) => record.id === "fringemtl-2027-watch")?.sourceUrl,
    "https://www.montrealfringe.ca/",
  );
  assert.equal(
    festivalRadar.find((record) => record.id === "halifax-fringe-2027-watch")?.sourceUrl,
    "https://halifaxfringe.ca/",
  );

  const representation = funding.find((record) => record.id === "cca-representation");
  assert.ok(representation);
  assert.deepEqual(representation.profiles, ["organization"]);
  assert.deepEqual(representation.residencies, ["canada"]);

  const newcomer = funding.find((record) => record.id === "tac-newcomer-mentorship");
  assert.ok(newcomer.eligibility.individualStatuses.includes("temporary_work"));
  assert.equal(newcomer.eligibility.sinRequired, true);
  assert.equal(newcomer.eligibility.arrivalOnOrAfter, "2019-01-01");

  const ottawa = funding.find((record) => record.id === "ottawa-creation-production");
  assert.deepEqual(ottawa.residencies, ["ottawa"]);
  assert.ok(ottawa.eligibility.verificationStatuses.includes("temporary_work"));

  const artworks = funding.find((record) => record.id === "artworks-to-newcomer");
  assert.equal(artworks.kind, "paid_program");
  assert.ok(artworks.eligibility.conditionalStatuses.includes("temporary_work"));

  const leLevier = funding.find((record) => record.id === "quebec-city-le-levier");
  assert.deepEqual(leLevier.residencies, ["quebec_city"]);
  assert.deepEqual(leLevier.eligibility.individualStatuses, ["citizen", "permanent"]);
  assert.equal(leLevier.eligibility.professionalPracticeVerificationRequired, true);

  const oifMobility = funding.find((record) => record.id === "oif-artist-mobility-2026");
  assert.deepEqual(oifMobility.profiles, ["artist", "collective"]);
  assert.ok(oifMobility.eligibility.verificationStatuses.includes("temporary_work"));

  const enPisteReimbursement = funding.find((record) => record.id === "en-piste-training-expense-reimbursement-2026");
  assert.deepEqual(enPisteReimbursement.residencies, ["quebec"]);
  assert.deepEqual(enPisteReimbursement.disciplines, ["circus"]);
  assert.equal(enPisteReimbursement.eligibility.individualStatuses, undefined);
  assert.equal(enPisteReimbursement.eligibility.professionalPracticeVerificationRequired, true);

  const personalizedTraining = funding.find((record) => record.id === "en-piste-personalized-training-2026");
  assert.deepEqual(personalizedTraining.residencies, ["quebec"]);
  assert.ok(personalizedTraining.eligibility.verificationStatuses.includes("temporary_work"));
  assert.equal(personalizedTraining.eligibility.professionalPracticeVerificationRequired, true);

  const firstRideau = funding.find((record) => record.id === "en-piste-mon-premier-rideau");
  assert.deepEqual(firstRideau.residencies, ["quebec"]);
  assert.ok(firstRideau.eligibility.individualStatuses.includes("temporary_work"));
  assert.ok(!firstRideau.eligibility.individualStatuses.includes("temporary_no_work"));

  const microGrants = funding.find((record) => record.id === "cca-microgrants");
  assert.equal(microGrants.name, "Canada Council — Micro-grants");
  assert.equal(microGrants.verifiedAt, "2026-07-22");
  assert.equal(microGrants.sourceUrl, "https://canadacouncil.ca/funding/grants/arts-across-canada-and-abroad");

  for (const record of opportunities.filter((item) => item.country !== "Canada")) {
    assert.ok(
      record.fundingMatches.some((match) => match.fundingId === "cca-microgrants"),
      `Missing Canada-wide micro-grant screen: ${record.id}`,
    );
  }
});
