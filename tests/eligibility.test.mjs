import assert from "node:assert/strict";
import test from "node:test";
import { evaluateFundingEligibility, supportsResidence } from "../app/eligibility.mjs";

const baseAnswers = {
  baseState: "possible",
  legalStatus: "unsure",
  provinceHistory: "unsure",
  torontoHistory: "unsure",
  collectiveComposition: "unsure",
  collectiveSize: "unsure",
  organizationRegistration: "unsure",
  sinStatus: "unsure",
  canadaArrival: "unsure",
  ageBand: "unsure",
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
  const eligibility = {
    individualStatuses: ["citizen", "permanent"],
    minimumProvinceMonths: 12,
  };
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "permanent",
      provinceHistory: "twelve_plus",
    }).state,
    "possible",
  );
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "protected",
      provinceHistory: "twelve_plus",
    }).state,
    "ineligible",
  );
});

test("Canada Council accepts protected persons but not temporary residents", () => {
  const eligibility = { individualStatuses: ["citizen", "permanent", "protected"] };
  assert.equal(
    evaluate("artist", eligibility, { legalStatus: "protected" }).state,
    "possible",
  );
  assert.equal(
    evaluate("artist", eligibility, { legalStatus: "temporary_work" }).state,
    "ineligible",
  );
});

test("Canada Council requires both core members of a duo to qualify", () => {
  const eligibility = { collectiveRule: "cca_half" };
  assert.equal(
    evaluate("collective", eligibility, {
      collectiveSize: "two",
      collectiveComposition: "half_qualified",
    }).state,
    "ineligible",
  );
  assert.equal(
    evaluate("collective", eligibility, {
      collectiveSize: "two",
      collectiveComposition: "all",
    }).state,
    "possible",
  );
});

test("Ontario Arts Council accepts pending PR applicants after 12 Ontario months", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "permanent_pending"],
    minimumProvinceMonths: 12,
  };
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "permanent_pending",
      provinceHistory: "twelve_plus",
    }).state,
    "possible",
  );
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "temporary_work",
      provinceHistory: "twelve_plus",
    }).state,
    "ineligible",
  );
});

test("Toronto newcomer mentorship can accept a work-authorized temporary resident", () => {
  const eligibility = {
    individualStatuses: [
      "citizen",
      "permanent",
      "protected",
      "permanent_pending",
      "temporary_work",
    ],
    sinRequired: true,
    arrivalOnOrAfter: "2019-01-01",
    ageRange: { min: 18 },
  };
  const validAnswers = {
    legalStatus: "temporary_work",
    sinStatus: "yes",
    canadaArrival: "after_2019",
    ageBand: "eighteen_thirty",
  };
  assert.equal(evaluate("artist", eligibility, validAnswers).state, "possible");
  assert.equal(
    evaluate("artist", eligibility, { ...validAnswers, sinStatus: "no" }).state,
    "ineligible",
  );
});

test("ArtWorksTO marks work-authorized temporary status as conditional", () => {
  const eligibility = {
    individualStatuses: ["permanent", "temporary_work"],
    conditionalStatuses: ["temporary_work"],
  };
  const result = evaluate("artist", eligibility, { legalStatus: "temporary_work" });
  assert.equal(result.state, "conditional");
  assert.ok(result.reasonKeys.includes("statusConditional"));
});

test("Ottawa programs do not invent a citizenship rule", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "protected", "permanent_pending"],
    verificationStatuses: ["temporary_work", "temporary_no_work"],
    ageRange: { min: 18 },
  };
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "temporary_work",
      ageBand: "over_thirty",
    }).state,
    "verify",
  );
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "protected",
      ageBand: "over_thirty",
    }).state,
    "possible",
  );
});

test("Toronto city history and SIN remain separate gates", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "permanent_pending"],
    minimumTorontoMonths: 12,
    sinRequired: true,
    ageRange: { min: 18 },
  };
  const answers = {
    legalStatus: "permanent_pending",
    torontoHistory: "meets",
    sinStatus: "yes",
    ageBand: "over_thirty",
  };
  assert.equal(evaluate("artist", eligibility, answers).state, "possible");
  assert.equal(
    evaluate("artist", eligibility, { ...answers, torontoHistory: "does_not" }).state,
    "ineligible",
  );
});

test("residence scopes distinguish cities, metro areas, provinces and Canada", () => {
  assert.equal(supportsResidence({ residencies: ["canada"] }, "gatineau"), true);
  assert.equal(supportsResidence({ residencies: ["quebec_city"] }, "quebec_city"), true);
  assert.equal(supportsResidence({ residencies: ["quebec_city"] }, "quebec"), false);
  assert.equal(supportsResidence({ residencies: ["quebec"] }, "ottawa"), false);
  assert.equal(supportsResidence({ residencies: ["ontario"] }, "toronto"), true);
  assert.equal(supportsResidence({ residencies: ["gta"] }, "toronto"), true);
  assert.equal(supportsResidence({ residencies: ["toronto"] }, "gta"), false);
  assert.equal(supportsResidence({ residencies: ["ottawa"] }, "ottawa"), true);
});

test("professional-practice evidence keeps a municipal artist grant in verification", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent"],
    professionalPracticeVerificationRequired: true,
  };
  const eligibleStatus = evaluate("artist", eligibility, { legalStatus: "permanent" });
  assert.equal(eligibleStatus.state, "verify");
  assert.ok(eligibleStatus.reasonKeys.includes("professionalPracticeCheck"));
  assert.equal(
    evaluate("artist", eligibility, { legalStatus: "temporary_work" }).state,
    "ineligible",
  );
});

test("Quebec circus reimbursement does not invent a citizenship exclusion", () => {
  const eligibility = { professionalPracticeVerificationRequired: true };
  const result = evaluate("artist", eligibility, { legalStatus: "temporary_work" });
  assert.equal(result.state, "verify");
  assert.ok(result.reasonKeys.includes("professionalPracticeCheck"));
  assert.ok(!result.reasonKeys.includes("statusNotAccepted"));
});

test("OIF mobility keeps every Canadian status in source-level verification", () => {
  const eligibility = {
    verificationStatuses: [
      "citizen",
      "permanent",
      "protected",
      "permanent_pending",
      "temporary_work",
      "temporary_no_work",
    ],
    professionalPracticeVerificationRequired: true,
  };
  for (const legalStatus of eligibility.verificationStatuses) {
    assert.equal(evaluate("artist", eligibility, { legalStatus }).state, "verify");
  }
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
