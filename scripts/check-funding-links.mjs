import { readFile } from "node:fs/promises";

const funding = JSON.parse(await readFile(new URL("../data/funding.json", import.meta.url), "utf8"));
const owners = new Map();

for (const record of funding) {
  for (const [field, url] of [["source", record.sourceUrl], ["eligibility", record.eligibility.sourceUrl]]) {
    const uses = owners.get(url) ?? [];
    uses.push(`${record.id}:${field}`);
    owners.set(url, uses);
  }
}

const entries = [...owners.entries()];
const results = [];
let cursor = 0;

async function checkUrl([url, uses]) {
  let lastError;
  for (const timeout of [15_000, 30_000]) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "MESURE funding source audit/1.0" },
        signal: AbortSignal.timeout(timeout),
      });
      const status = response.status;
      const classification = status >= 200 && status < 400
        ? "healthy"
        : [401, 403, 405, 429].includes(status)
          ? "restricted"
          : [404, 410].includes(status)
            ? "dead"
            : "error";
      return { url, uses, status, classification, finalUrl: response.url };
    } catch (error) {
      lastError = error;
    }
  }
  return {
    url,
    uses,
    status: "network",
    classification: "unreachable",
    finalUrl: url,
    detail: lastError instanceof Error ? lastError.name : "UnknownError",
  };
}

async function worker() {
  while (cursor < entries.length) {
    const entry = entries[cursor];
    cursor += 1;
    results.push(await checkUrl(entry));
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

results.sort((a, b) => a.classification.localeCompare(b.classification) || a.url.localeCompare(b.url));
for (const result of results) {
  const redirect = result.finalUrl !== result.url ? ` -> ${result.finalUrl}` : "";
  const detail = result.detail ? ` (${result.detail})` : "";
  console.log(`${result.classification}\t${result.status}\t${result.url}${redirect}${detail}\t${result.uses.join(",")}`);
}

const summary = Object.fromEntries(
  ["healthy", "restricted", "dead", "error", "unreachable"].map((classification) => [
    classification,
    results.filter((result) => result.classification === classification).length,
  ]),
);
console.log(`SUMMARY\t${JSON.stringify({ total: results.length, ...summary })}`);

if (summary.dead > 0) process.exitCode = 1;
