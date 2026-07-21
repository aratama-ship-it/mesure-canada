import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

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
  assert.match(html, /Ville de Toronto/);
  assert.match(html, /Ville d’Ottawa/);
  assert.match(html, /Gatineau/);
  assert.match(html, /Festival Mondial du Cirque de Demain/);
  assert.match(html, /CALQ — Déplacement/);
  assert.match(html, /Canada Council — Arts Abroad: Travel/);
  assert.match(html, /Votre statut au Canada/);
  assert.match(html, /Radar international/);
  assert.match(html, /Imaginarius 2027 — International Open Call/);
  assert.match(html, /Canadian Association of Fringe Festivals — Touring Lottery/);
  assert.match(html, /IDFA Forum 2026 — Project Entry/);
  assert.match(html, /Sundance Film Festival 2027/);
  assert.match(html, /Contact ontarois 2027/);
  assert.match(html, /CINARS Biennale 2026 — OFF-CINARS Showcase/);
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
  assert.ok(funding.length >= 16);
  for (const record of opportunities) {
    assert.ok(record.country && record.city);
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assert.match(record.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
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
    assert.match(record.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(record.profiles.length > 0);
    assert.ok(record.residencies.length > 0);
    assert.ok(record.residencies.every((scope) =>
      ["canada", "quebec", "montreal", "ontario", "gta", "toronto", "ottawa"].includes(scope)
    ));
    assert.ok(["mobility_export", "home_base_creation", "career_support"].includes(record.purpose));
    assert.ok(["grant", "paid_program"].includes(record.kind));
    assert.ok(record.deadline.ja);
    assert.ok(record.amount.ja);
    assert.ok(record.cashflow.ja);
    assert.ok(record.eligibility);
    assert.ok(record.eligibility.note.fr);
    assert.ok(record.eligibility.note.en);
    assert.ok(record.eligibility.note.ja);
    assert.ok(/^https?:\/\//.test(record.eligibility.sourceUrl));
    assert.match(record.eligibility.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  }

  assert.ok(festivalRadar.length >= 41);
  assert.deepEqual(new Set(festivalRadar.map((record) => record.family)), new Set(["circus", "street", "fringe", "film", "showcase"]));
  assert.ok(new Set(festivalRadar.map((record) => record.region)).size >= 6);
  assert.ok(festivalRadar.filter((record) => record.family === "circus").length >= 7);
  assert.ok(festivalRadar.filter((record) => record.family === "street").length >= 7);
  assert.ok(festivalRadar.filter((record) => record.family === "fringe").length >= 12);
  assert.ok(festivalRadar.filter((record) => record.family === "showcase").length >= 6);
  assert.ok(festivalRadar.some((record) => record.id === "caff-touring-lottery-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "bnfn-artist-call-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "contact-ontarois-2027-watch"));
  assert.ok(festivalRadar.some((record) => record.id === "roseq-seasonal-2027-28"));
  for (const record of festivalRadar) {
    assert.ok(record.title && record.country && record.city);
    assert.ok(["circus", "street", "fringe", "film", "showcase"].includes(record.family));
    assert.ok(["international", "open_access", "selection", "regional_conditions", "language_conditions", "eligibility_check"].includes(record.participation));
    assert.ok(["open", "upcoming", "watch"].includes(record.status));
    assert.ok(/^https?:\/\//.test(record.sourceUrl));
    assert.match(record.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(record.nextCheckDate, /^\d{4}-\d{2}-\d{2}$/);
    if (record.deadlineDate) assert.match(record.deadlineDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(record.deadlineLabel.ja);
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

  for (const record of opportunities.filter((item) => item.country !== "Canada")) {
    assert.ok(
      record.fundingMatches.some((match) => match.fundingId === "cca-travel"),
      `Missing Canada-wide travel screen: ${record.id}`,
    );
  }
});
