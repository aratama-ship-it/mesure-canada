const qualifyingCollectiveShares = {
  cca_half: new Set(["all", "three_quarters", "two_thirds", "majority_qualified", "half_qualified"]),
  cam_two_thirds: new Set(["all", "three_quarters", "two_thirds"]),
  oac_half: new Set(["all", "three_quarters", "two_thirds", "majority_qualified", "half_qualified"]),
  tac_majority: new Set(["all", "three_quarters", "two_thirds", "majority_qualified"]),
  ottawa_half: new Set(["all", "three_quarters", "two_thirds", "majority_qualified", "half_qualified"]),
  afa_all: new Set(["all"]),
  sk_half: new Set(["all", "three_quarters", "two_thirds", "majority_qualified", "half_qualified"]),
  ns_majority: new Set(["all", "three_quarters", "two_thirds", "majority_qualified"]),
  pei_majority: new Set(["all", "three_quarters", "two_thirds", "majority_qualified"]),
  yukon_three_quarters: new Set(["all", "three_quarters"]),
};

const statePriority = {
  possible: 0,
  conditional: 1,
  verify: 2,
  ineligible: 3,
};

function raiseState(current, next) {
  return statePriority[next] > statePriority[current] ? next : current;
}

/**
 * Converts source-backed program rules and applicant answers into a
 * conservative pre-screen. Unknown answers never become a positive match.
 */
export function evaluateFundingEligibility({
  funding,
  baseState,
  profile,
  legalStatus,
  provinceHistory,
  torontoHistory,
  collectiveComposition,
  collectiveSize,
  organizationRegistration,
  sinStatus,
  canadaArrival,
  ageBand,
}) {
  const rules = funding.eligibility;
  let state = baseState;
  const reasonKeys = [];

  const addReason = (reason) => {
    if (!reasonKeys.includes(reason)) reasonKeys.push(reason);
  };

  const checkStatus = (acceptedStatuses) => {
    const hasStatusRule =
      acceptedStatuses?.length ||
      rules.conditionalStatuses?.length ||
      rules.verificationStatuses?.length;
    if (!hasStatusRule) return;

    if (legalStatus === "unsure") {
      state = raiseState(state, "verify");
      addReason("statusUnknown");
      return;
    }

    if (rules.verificationStatuses?.includes(legalStatus)) {
      state = raiseState(state, "verify");
      addReason("statusVerification");
      return;
    }

    if (!acceptedStatuses?.includes(legalStatus)) {
      state = "ineligible";
      addReason("statusNotAccepted");
      return;
    }

    if (rules.conditionalStatuses?.includes(legalStatus)) {
      state = raiseState(state, "conditional");
      addReason("statusConditional");
    }
  };

  if (profile === "artist") checkStatus(rules.individualStatuses);
  if (profile === "collective") checkStatus(rules.representativeStatuses);

  if (profile !== "organization" && rules.minimumProvinceMonths) {
    if (provinceHistory === "unsure") {
      state = raiseState(state, "verify");
      addReason("provinceHistoryUnknown");
    } else if (
      (rules.minimumProvinceMonths === 12 && provinceHistory !== "twelve_plus") ||
      (rules.minimumProvinceMonths === 6 && provinceHistory === "under_six")
    ) {
      state = "ineligible";
      addReason("provinceHistoryTooShort");
    }
  }

  if (profile === "artist" && rules.minimumTorontoMonths === 12) {
    if (torontoHistory === "unsure") {
      state = raiseState(state, "verify");
      addReason("torontoHistoryUnknown");
    } else if (torontoHistory === "does_not") {
      state = "ineligible";
      addReason("torontoHistoryTooShort");
    }
  }

  if (profile === "collective" && rules.collectiveRule) {
    if (collectiveComposition === "unsure") {
      state = raiseState(state, "verify");
      addReason("groupUnknown");
    } else {
      const eligibleShare = qualifyingCollectiveShares[rules.collectiveRule];
      const duoFailsCanadaCouncilRule =
        rules.collectiveRule === "cca_half" &&
        collectiveSize === "two" &&
        collectiveComposition !== "all";
      if (!eligibleShare?.has(collectiveComposition) || duoFailsCanadaCouncilRule) {
        state = "ineligible";
        addReason("groupNotEnough");
      }
    }
    if (collectiveSize === "unsure") {
      state = raiseState(state, "verify");
      addReason("groupSizeUnknown");
    }
  }

  if (profile === "organization" && rules.organizationRegisteredInCanada) {
    if (organizationRegistration === "unsure") {
      state = raiseState(state, "verify");
      addReason("organizationUnknown");
    } else if (organizationRegistration === "no") {
      state = "ineligible";
      addReason("organizationNotEligible");
    }
  }

  if (profile === "organization" && rules.organizationVerificationRequired) {
    state = raiseState(state, "verify");
    addReason("organizationProgramCheck");
  }

  if (profile === "artist" && rules.professionalPracticeVerificationRequired) {
    state = raiseState(state, "verify");
    addReason("professionalPracticeCheck");
  }

  if (profile === "artist" && rules.sinRequired) {
    if (sinStatus === "unsure") {
      state = raiseState(state, "verify");
      addReason("sinUnknown");
    } else if (sinStatus === "no") {
      state = "ineligible";
      addReason("sinMissing");
    }
  }

  if (profile === "artist" && rules.arrivalOnOrAfter === "2019-01-01") {
    if (canadaArrival === "unsure") {
      state = raiseState(state, "verify");
      addReason("arrivalUnknown");
    } else if (canadaArrival === "before_2019") {
      state = "ineligible";
      addReason("arrivalTooEarly");
    }
  }

  if (profile === "artist" && rules.ageRange) {
    if (ageBand === "unsure") {
      state = raiseState(state, "verify");
      addReason("ageUnknown");
    } else {
      const tooYoung = rules.ageRange.min === 18 && ageBand === "under_18";
      const tooOld = rules.ageRange.max === 30 && ageBand === "over_thirty";
      if (tooYoung || tooOld) {
        state = "ineligible";
        addReason("ageOutOfRange");
      }
    }
  }

  return { state, reasonKeys };
}

const residenceScopes = {
  montreal: new Set(["canada", "quebec", "montreal"]),
  quebec_city: new Set(["canada", "quebec", "quebec_city"]),
  quebec: new Set(["canada", "quebec"]),
  gatineau: new Set(["canada", "quebec"]),
  toronto: new Set(["canada", "ontario", "gta", "toronto"]),
  gta: new Set(["canada", "ontario", "gta"]),
  ottawa: new Set(["canada", "ontario", "ottawa"]),
  british_columbia: new Set(["canada", "british_columbia"]),
  alberta: new Set(["canada", "alberta"]),
  saskatchewan: new Set(["canada", "saskatchewan"]),
  manitoba: new Set(["canada", "manitoba"]),
  new_brunswick: new Set(["canada", "new_brunswick"]),
  nova_scotia: new Set(["canada", "nova_scotia"]),
  prince_edward_island: new Set(["canada", "prince_edward_island"]),
  newfoundland_labrador: new Set(["canada", "newfoundland_labrador"]),
  yukon: new Set(["canada", "yukon"]),
  northwest_territories: new Set(["canada", "northwest_territories"]),
  nunavut: new Set(["canada", "nunavut"]),
};

export function supportsResidence(funding, residence) {
  const supportedScopes = residenceScopes[residence];
  return Boolean(
    supportedScopes && funding.residencies.some((scope) => supportedScopes.has(scope)),
  );
}
