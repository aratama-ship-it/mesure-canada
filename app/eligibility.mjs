const qualifyingCollectiveShares = {
  cca_half: new Set(["all", "two_thirds", "half_qualified"]),
  cam_two_thirds: new Set(["all", "two_thirds"]),
};

function needsVerification(state) {
  return state === "ineligible" ? state : "verify";
}

/**
 * Converts verified funding rules and applicant answers into a conservative
 * pre-screen. Unknown answers never become a positive match.
 */
export function evaluateFundingEligibility({
  funding,
  baseState,
  profile,
  legalStatus,
  quebecHistory,
  collectiveComposition,
  organizationRegistration,
}) {
  const rules = funding.eligibility;
  let state = baseState;
  const reasonKeys = [];

  const checkStatus = (acceptedStatuses) => {
    if (!acceptedStatuses?.length) return;
    if (legalStatus === "unsure") {
      state = needsVerification(state);
      reasonKeys.push("statusUnknown");
    } else if (!acceptedStatuses.includes(legalStatus)) {
      state = "ineligible";
      reasonKeys.push("statusNotAccepted");
    }
  };

  if (profile === "artist") {
    checkStatus(rules.individualStatuses);
  }

  if (profile === "collective") {
    checkStatus(rules.representativeStatuses);
    if (rules.collectiveRule) {
      if (collectiveComposition === "unsure") {
        state = needsVerification(state);
        reasonKeys.push("groupUnknown");
      } else if (!qualifyingCollectiveShares[rules.collectiveRule].has(collectiveComposition)) {
        state = "ineligible";
        reasonKeys.push("groupNotEnough");
      }
    }
  }

  if (profile === "artist" && rules.minimumQuebecMonths === 12) {
    if (quebecHistory === "unsure") {
      state = needsVerification(state);
      reasonKeys.push("residencyUnknown");
    } else if (quebecHistory === "under_twelve") {
      state = "ineligible";
      reasonKeys.push("residencyTooShort");
    }
  }

  if (profile === "organization" && rules.organizationRegisteredInCanada) {
    if (organizationRegistration === "unsure") {
      state = needsVerification(state);
      reasonKeys.push("organizationUnknown");
    } else if (organizationRegistration === "no") {
      state = "ineligible";
      reasonKeys.push("organizationNotEligible");
    }
  }

  return { state, reasonKeys };
}
