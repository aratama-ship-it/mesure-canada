import { readFile } from "node:fs/promises";

const funding = JSON.parse(await readFile(new URL("../data/funding.json", import.meta.url), "utf8"));
const dateArgumentIndex = process.argv.findIndex((argument) => argument === "--date");
const inlineDateArgument = process.argv.find((argument) => argument.startsWith("--date="));
const hasExplicitAuditDate = Boolean(inlineDateArgument || dateArgumentIndex >= 0);
const asOf = inlineDateArgument?.slice("--date=".length)
  ?? (dateArgumentIndex >= 0 ? process.argv[dateArgumentIndex + 1] : undefined)
  ?? new Date().toISOString().slice(0, 10);
const now = new Date();

function isISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

if (!isISODate(asOf)) {
  console.error(`ERROR\tinvalid audit date\t${asOf ?? "missing"}`);
  process.exit(1);
}

function dateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

const errors = [];
const due = [];
const ids = new Set();

for (const record of funding) {
  let recordAsOf = asOf;
  if (!hasExplicitAuditDate && record.deadlineTimeZone) {
    try {
      recordAsOf = dateInTimeZone(now, record.deadlineTimeZone);
    } catch {
      errors.push(`${record.id}\tinvalid deadlineTimeZone: ${record.deadlineTimeZone}`);
    }
  }

  if (!record.id || ids.has(record.id)) {
    errors.push(`${record.id || "missing-id"}\tduplicate or missing id`);
  }
  ids.add(record.id);

  if (!Object.hasOwn(record, "deadlineDate")) {
    errors.push(`${record.id}\tdeadlineDate must be present, using null when no exact official date is published`);
  } else if (record.deadlineDate !== null && !isISODate(record.deadlineDate)) {
    errors.push(`${record.id}\tinvalid deadlineDate: ${record.deadlineDate}`);
  }

  if (!isISODate(record.verifiedAt)) {
    errors.push(`${record.id}\tinvalid verifiedAt: ${record.verifiedAt}`);
  }
  if (!isISODate(record.nextCheckDate)) {
    errors.push(`${record.id}\tinvalid nextCheckDate: ${record.nextCheckDate}`);
  }
  if (isISODate(record.verifiedAt) && isISODate(record.nextCheckDate) && record.nextCheckDate < record.verifiedAt) {
    errors.push(`${record.id}\tnextCheckDate predates verifiedAt`);
  }

  const isClosed = record.availability === "closed";
  if (!isClosed && isISODate(record.deadlineDate) && record.deadlineDate < recordAsOf) {
    errors.push(`${record.id}\tactive record passed its deadline on ${record.deadlineDate}`);
  }
  if (!isClosed && isISODate(record.deadlineDate) && isISODate(record.nextCheckDate) && record.nextCheckDate > record.deadlineDate) {
    errors.push(`${record.id}\tnextCheckDate falls after its active deadline`);
  }
  if (isISODate(record.nextCheckDate) && record.nextCheckDate < recordAsOf) {
    due.push(`${record.id}\tsource review due ${record.nextCheckDate}`);
  }
}

for (const finding of errors) console.error(`ERROR\t${finding}`);
for (const finding of due) console.error(`DUE\t${finding}`);

const summary = {
  asOf,
  total: funding.length,
  exactDeadlines: funding.filter((record) => record.deadlineDate !== null).length,
  noExactDeadline: funding.filter((record) => record.deadlineDate === null).length,
  closed: funding.filter((record) => record.availability === "closed").length,
  errors: errors.length,
  reviewsDue: due.length,
};
console.log(`SUMMARY\t${JSON.stringify(summary)}`);

if (errors.length || due.length) process.exitCode = 1;
