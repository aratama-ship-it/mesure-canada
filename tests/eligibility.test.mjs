import assert from "node:assert/strict";
import test from "node:test";
import { evaluateFundingEligibility } from "../app/eligibility.mjs";

const baseAnswers = {
  baseState: "possible",
  legalStatus: "unsure",
  quebecHistory: "unsure",
  collectiveComposition: "unsure",
  organizationRegistration: "unsure",
};

function evaluate(profile, eligibility, answers = {}) {
  return evaluateFundingEligibility({
    ...baseAnswers,
    ...answers,
    profile,
    funding: { eligibility },
  });
}

test("CALQ accepts permanent residents after 12 months in Québec", () => {
  const result = evaluate(
    "artist",
    { individualStatuses: ["citizen", "permanent"], minimumQuebecMonths: 12 },
    { legalStatus: "permanent", quebecHistory: "twelve_plus" },
  );
  assert.equal(result.state, "possible");
});

test("CALQ does not accept protected or short-term residents", () => {
  assert.equal(
    evaluate(
      "artist",
      { individualStatuses: ["citizen", "permanent"], minimumQuebecMonths: 12 },
      { legalStatus: "protected", quebecHistory: "twelve_plus" },
    ).state,
    "ineligible",
  );
  assert.equal(
    evaluate(
      "artist",
      { individualStatuses: ["citizen", "permanent"], minimumQuebecMonths: 12 },
      { legalStatus: "permanent", quebecHistory: "under_twelve" },
    ).state,
    "ineligible",
  );
});

test("Canada Council accepts protected persons but not temporary residents", () => {
  const eligibility = { individualStatuses: ["citizen", "permanent", "protected"] };
  assert.equal(evaluate("artist", eligibility, { legalStatus: "protected" }).state, "possible");
  assert.equal(evaluate("artist", eligibility, { legalStatus: "temporary" }).state, "ineligible");
});

test("collective thresholds differ between Canada Council and CAM", () => {
  assert.equal(
    evaluate(
      "collective",
      { collectiveRule: "cca_half" },
      { collectiveComposition: "half_qualified" },
    ).state,
    "possible",
  );
  assert.equal(
    evaluate(
      "collective",
      { representativeStatuses: ["citizen", "permanent"], collectiveRule: "cam_two_thirds" },
      { legalStatus: "permanent", collectiveComposition: "half_qualified" },
    ).state,
    "ineligible",
  );
});

test("unknown answers stay in verification and unregistered organizations are excluded", () => {
  assert.equal(
    evaluate("artist", { individualStatuses: ["citizen", "permanent"] }).state,
    "verify",
  );
  assert.equal(
    evaluate(
      "organization",
      { organizationRegisteredInCanada: true },
      { organizationRegistration: "no" },
    ).state,
    "ineligible",
  );
});
