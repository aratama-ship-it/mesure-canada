# Canada funding audit — 2026-07-23

## Conclusion

The beta now covers every Canadian province and territory as a residence choice. The funding database contains 45 records, including six Canada-wide programs, so every residence is included in the geographic scope of federal programs even when no current local project grant can be verified.

No release-blocking data defect was found after the final territory expansion. One substantive eligibility defect was corrected during the audit: the Northwest Territories uses a six-month residence threshold, so the former 12-month yes/no question was replaced with four choices that distinguish 12+ months, 6–11 months, under 6 months, and unknown.

This is a source-backed beta collection, not a claim that every Canadian arts program has been exhaustively catalogued.

## Final territory additions

| Region | Included records | Source-backed points |
|---|---|---|
| Northwest Territories | Small Arts Project Fund; Medium Arts Project Grant; Artist Travel and Touring Fund | The redesigned programs were announced as open on April 17, 2026. The Small and Travel funds are rolling until the annual budget is exhausted. The Medium fund has a current October 31, 2026 intake. Individual and group applicants need at least six months of NWT residence. |
| Nunavut | Commissioner’s Arts Award | The current Commissioner site says nominations have no deadline. The award is $10,000 and requires a third-party nomination. Immigration status and the year’s exact discipline category require confirmation. |

Primary sources:

- [NWT arts program redesign announcement](https://www.gov.nt.ca/en/newsroom/revamped-nwt-arts-programs-better-fit-artists-applications-open-now)
- [NWT Small Arts Project Fund](https://www.iti.gov.nt.ca/en/services/small-arts-project-fund)
- [NWT Medium Arts Project Grant](https://www.iti.gov.nt.ca/en/services/medium-arts-project-grant)
- [NWT Artist Travel and Touring Fund](https://www.iti.gov.nt.ca/en/services/artist-travel-and-tour-fund)
- [Nunavut Commissioner’s Arts Award](https://commissioner.gov.nu.ca/en/arts.aspx)

## Nunavut regular arts funding decision

The Nunavut Culture and Heritage application form still lists “Arts Contributions” and says January 31 each year. However, the governing policy available on the official site explicitly sunset on March 31, 2026. No replacement 2026–27 policy or current Arts Contributions call was found on the official site during this audit.

The regular Arts Contributions program was therefore **not promoted as current funding**. It should remain a research lead until Culture and Heritage confirms the 2026–27 authority, deadline, amount, payment terms, and applicant rules.

- [Expired Culture and Heritage Grants and Contributions Policy](https://www.gov.nu.ca/sites/default/files/documents/2025-02/CH_Grants_and_Contributions_Policy_03_23.pdf)
- [Application form still present on the official site](https://www.gov.nu.ca/sites/default/files/documents/2025-06/APPLICATION_FORM_-_CH_Grants___Contributions__Sept_27__2024__EN.pdf)

## Automated integrity checks

| Check | Result |
|---|---|
| Funding records | 45 |
| Duplicate IDs | 0 |
| Duplicate names | 0 |
| Missing FR / EN / JA deadline, amount, cash-flow, or eligibility text | 0 |
| Invalid residence, purpose, kind, coverage, or residence-month enum | 0 |
| Missing or malformed official URLs and verification dates | 0 |
| Type check | Pass |
| Lint | Pass |
| Build and test suite | Pass — 22 tests |

The eligibility tests now separately cover federal, provincial, municipal, non-citizen, collective-composition, six-month NWT, and 12-month province rules. Unknown information continues to resolve to “needs confirmation,” never to a positive eligibility result.

## Official-link audit

`npm run audit:funding-links` checked all 55 unique funding and eligibility URLs using GET requests and redirects.

| Classification | Count | Interpretation |
|---|---:|---|
| Healthy (HTTP 2xx/3xx) | 50 | Reachable during this audit |
| Access-restricted (HTTP 403) | 5 | Nunavut Commissioner and Yukon pages block this automated client; these are not treated as dead links |
| Confirmed dead (HTTP 404/410) | 0 | No dead funding source found |
| Other HTTP or network error | 0 | None |

## Remaining non-blocking risks

1. Funding deadlines are currently localized text rather than a machine-readable `deadlineDate` plus `nextCheckDate`. Eight records are explicitly marked closed, but future expiry still needs manual review. Adding structured dates is the highest-value next data-quality change when monitoring work resumes.
2. Five official pages restrict automated access. Their records remain usable because the pages are live and the content was checked through official search/indexed results, but they should be manually opened during the next content review.
3. Nunavut’s regular Arts Contributions route needs direct 2026–27 confirmation before insertion. An older policy and a surviving form are not sufficient evidence of a current call.
4. Several local programs do not state immigration status. Those records deliberately return “needs confirmation” for every status rather than inventing citizen or permanent-resident eligibility.

## Reproduction

```bash
npm run typecheck
npm run lint
npm test
npm run audit:funding-links
```
