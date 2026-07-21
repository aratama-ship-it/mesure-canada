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

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
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
  assert.match(html, /Avant d’envoyer le dossier/);
  assert.match(html, /Où résidez-vous actuellement/);
  assert.match(html, /À propos des informations/);
  assert.match(html, /Ce site est actuellement en version bêta/);
  assert.match(html, /docs\.google\.com\/forms/);
  assert.match(html, /Ville de Toronto/);
  assert.match(html, /Ville d’Ottawa/);
  assert.match(html, /Ville de Québec/);
  assert.match(html, /Gatineau/);
  assert.match(html, /Festival Mondial du Cirque de Demain/);
  assert.match(html, /CALQ — Déplacement/);
  assert.match(html, /Canada Council — Arts Abroad: Travel/);
  assert.match(html, /Votre statut au Canada/);
  assert.match(html, /Radar international/);
  assert.match(html, /Type d’occasion/);
  assert.match(html, /Appels de festivals régionaux/);
  assert.match(html, /Développement chorégraphique/);
  assert.match(html, /Résidences \/ création sur place/);
  assert.match(html, /Imaginarius 2027 — International Open Call/);
  assert.match(html, /Canadian Association of Fringe Festivals — Touring Lottery/);
  assert.match(html, /IDFA Forum 2026 — Project Entry/);
  assert.match(html, /Sundance Film Festival 2027/);
  assert.match(html, /Contact ontarois 2027/);
  assert.match(html, /CINARS Biennale 2026 — OFF-CINARS Showcase/);
  assert.match(html, /MICC — Tour de Piste \/ Pitch Sessions/);
  assert.match(html, /TOHU — Résidences de recherche et création/);
  assert.match(html, /DYNAMO — Non-thematic Circus Residency 2027–28/);
  assert.match(html, /Bergen Fringe Festival 2027/);
  assert.match(html, /FringeMTL — Main Festival Lottery/);
  assert.match(html, /OSAC Showcase 2027/);
  assert.match(html, /Pacific Contact — BC Performing Arts Showcase/);
  assert.match(html, /National Folk Festival — Circus and Street Performers/);
  assert.match(html, /Out There Arts — Supported Circus and Outdoor Arts Residency/);
  assert.match(html, /Guelph Fringe Festival — Artist Lottery/);
  assert.match(html, /Nogojiwanong Indigenous Fringe Festival/);
  assert.match(html, /Mostra Igualada 2027/);
  assert.match(html, /CubaDupa 2027/);
  assert.match(html, /6Fest Plovdiv/);
  assert.match(html, /Festival Internacional de Circo do Ceará/);
  assert.match(html, /World Buskers Festival 2027/);
  assert.match(html, /Nelson Fringe Festival 2027/);
  assert.match(html, /MASA Festival/);
  assert.match(html, /Gwangju Busking WorldCup/);
  assert.match(html, /AOCA 2027/);
  assert.match(html, /En Piste — Remboursement des dépenses d’entraînement/);
  assert.match(html, /En Piste — Formation individualisée \/ sur mesure/);
  assert.match(html, /En Piste — Mon premier RIDEAU/);
  assert.match(html, />JA<\/button>/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
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

  assert.ok(opportunities.length >= 6);
  assert.ok(funding.length >= 21);
  assert.equal(new Set(opportunities.map((record) => record.id)).size, opportunities.length, "Duplicate opportunity id");
  assert.equal(new Set(funding.map((record) => record.id)).size, funding.length, "Duplicate funding id");
  for (const record of opportunities) {
    assert.ok(record.country && record.city);
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assert.ok(!String(record.country).includes("海外"));
    assert.ok(record.deadlineLabel.ja);
    assert.ok(record.summary.ja);
    assert.ok(record.requirements.ja.length > 0);
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
  for (const record of funding) {
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assert.ok(record.profiles.length > 0);
    assert.ok(record.residencies.length > 0);
    assert.ok(record.residencies.every((scope) =>
      ["canada", "quebec", "quebec_city", "montreal", "ontario", "gta", "toronto", "ottawa"].includes(scope)
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

  assert.ok(festivalRadar.length >= 107);
  assert.equal(new Set(festivalRadar.map((record) => record.id)).size, festivalRadar.length, "Duplicate festival radar id");
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
  for (const record of festivalRadar) {
    assert.ok(record.title && record.country && record.city);
    assert.ok(["circus", "street", "fringe", "film", "showcase"].includes(record.family));
    assert.ok(["international", "open_access", "selection", "regional_conditions", "language_conditions", "eligibility_check"].includes(record.participation));
    assert.ok(["open", "upcoming", "watch"].includes(record.status));
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assertISODate(record.verifiedAt, `${record.id}.verifiedAt`);
    assertISODate(record.nextCheckDate, `${record.id}.nextCheckDate`);
    if (record.deadlineDate) assertISODate(record.deadlineDate, `${record.id}.deadlineDate`);
    for (const language of ["fr", "en", "ja"]) {
      assert.ok(record.deadlineLabel[language], `${record.id}.deadlineLabel.${language}`);
    }
  }

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

  for (const record of opportunities.filter((item) => item.country !== "Canada")) {
    assert.ok(
      record.fundingMatches.some((match) => match.fundingId === "cca-travel"),
      `Missing Canada-wide travel screen: ${record.id}`,
    );
  }
});
