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
  assert.equal(supportsResidence({ residencies: ["british_columbia"] }, "british_columbia"), true);
  assert.equal(supportsResidence({ residencies: ["alberta"] }, "saskatchewan"), false);
  assert.equal(supportsResidence({ residencies: ["canada"] }, "new_brunswick"), true);
  assert.equal(supportsResidence({ residencies: ["nova_scotia"] }, "nova_scotia"), true);
  assert.equal(supportsResidence({ residencies: ["prince_edward_island"] }, "newfoundland_labrador"), false);
  assert.equal(supportsResidence({ residencies: ["canada"] }, "yukon"), true);
  assert.equal(supportsResidence({ residencies: ["northwest_territories"] }, "northwest_territories"), true);
  assert.equal(supportsResidence({ residencies: ["nunavut"] }, "northwest_territories"), false);
  assert.equal(supportsResidence({ residencies: ["canada"] }, "nunavut"), true);
});

test("NWT six-month programs distinguish 6-11 months from under 6 months", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "protected", "permanent_pending", "temporary_work", "temporary_no_work"],
    verificationStatuses: ["citizen", "permanent", "protected", "permanent_pending", "temporary_work", "temporary_no_work"],
    minimumProvinceMonths: 6,
  };
  assert.equal(
    evaluate("artist", eligibility, {
      legalStatus: "permanent",
      provinceHistory: "six_to_eleven",
    }).state,
    "verify",
  );
  const underSix = evaluate("artist", eligibility, {
    legalStatus: "permanent",
    provinceHistory: "under_six",
  });
  assert.equal(underSix.state, "ineligible");
  assert.ok(underSix.reasonKeys.includes("provinceHistoryTooShort"));
});

test("Yukon Express Micro-grant enforces citizenship and the 75 percent collective rule", () => {
  const eligibility = {
    representativeStatuses: ["citizen", "permanent"],
    minimumProvinceMonths: 12,
    collectiveRule: "yukon_three_quarters",
  };
  const baseAnswers = {
    legalStatus: "permanent",
    provinceHistory: "twelve_plus",
    collectiveSize: "three_plus",
  };
  assert.equal(
    evaluate("collective", eligibility, { ...baseAnswers, collectiveComposition: "three_quarters" }).state,
    "possible",
  );
  assert.equal(
    evaluate("collective", eligibility, { ...baseAnswers, collectiveComposition: "two_thirds" }).state,
    "ineligible",
  );
  assert.equal(
    evaluate("collective", eligibility, { ...baseAnswers, legalStatus: "temporary_work", collectiveComposition: "all" }).state,
    "ineligible",
  );
});

test("PEI does not infer immigration eligibility from a residence-only public page", () => {
  const allListedStatuses = ["citizen", "permanent", "protected", "permanent_pending", "temporary_work", "temporary_no_work"];
  const eligibility = {
    individualStatuses: allListedStatuses,
    verificationStatuses: allListedStatuses,
    minimumProvinceMonths: 12,
  };
  const result = evaluate("artist", eligibility, {
    legalStatus: "temporary_work",
    provinceHistory: "twelve_plus",
  });
  assert.equal(result.state, "verify");
  assert.ok(result.reasonKeys.includes("statusVerification"));
});

test("Alberta includes Protected Persons conditionally and requires every project co-owner", () => {
  const eligibility = {
    representativeStatuses: ["citizen", "permanent", "protected"],
    conditionalStatuses: ["protected"],
    minimumProvinceMonths: 12,
    collectiveRule: "afa_all",
  };
  assert.equal(
    evaluate("collective", eligibility, {
      legalStatus: "protected",
      provinceHistory: "twelve_plus",
      collectiveSize: "three_plus",
      collectiveComposition: "all",
    }).state,
    "conditional",
  );
  assert.equal(
    evaluate("collective", eligibility, {
      legalStatus: "permanent",
      provinceHistory: "twelve_plus",
      collectiveSize: "three_plus",
      collectiveComposition: "two_thirds",
    }).state,
    "ineligible",
  );
});

test("New Brunswick keeps non-listed statuses in verification for the First Nation affiliation route", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "permanent_pending"],
    verificationStatuses: ["protected", "temporary_work", "temporary_no_work"],
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
    "verify",
  );
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

test("Mon premier RIDEAU keeps work-permit holders in the screening path", () => {
  const eligibility = {
    individualStatuses: ["citizen", "permanent", "temporary_work"],
    professionalPracticeVerificationRequired: true,
  };
  const workPermit = evaluate("artist", eligibility, { legalStatus: "temporary_work" });
  assert.equal(workPermit.state, "verify");
  assert.ok(workPermit.reasonKeys.includes("professionalPracticeCheck"));
  assert.ok(!workPermit.reasonKeys.includes("statusNotAccepted"));
  assert.equal(
    evaluate("artist", eligibility, { legalStatus: "temporary_no_work" }).state,
    "ineligible",
  );
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
