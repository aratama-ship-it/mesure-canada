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
  assert.match(html, /<title>MESURE — Québec/);
  assert.match(html, /Avant d’envoyer le dossier/);
  assert.match(html, /Festival Mondial du Cirque de Demain/);
  assert.match(html, /CALQ — Déplacement/);
  assert.match(html, /Votre statut au Canada/);
  assert.match(html, />JA<\/button>/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("opportunity and funding records preserve evidence fields", async () => {
  const [opportunitiesText, fundingText] = await Promise.all([
    readFile(new URL("data/opportunities.json", root), "utf8"),
    readFile(new URL("data/funding.json", root), "utf8"),
  ]);
  const opportunities = JSON.parse(opportunitiesText);
  const funding = JSON.parse(fundingText);
  const fundingIds = new Set(funding.map((record) => record.id));
  const fundingById = new Map(funding.map((record) => [record.id, record]));

  assert.ok(opportunities.length >= 6);
  assert.ok(funding.length >= 8);
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

  const representation = funding.find((record) => record.id === "cca-representation");
  assert.ok(representation);
  assert.deepEqual(representation.profiles, ["organization"]);
});
