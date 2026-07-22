# Canada funding audit — 2026-07-23

## Conclusion

The beta now covers every Canadian province and territory as a residence choice. The funding database contains 46 records, including six Canada-wide programs, so every residence is included in the geographic scope of federal programs even when no current local project grant can be verified.

The third audit pass found and corrected one high-impact status defect: the Nunavut Commissioner’s Arts Award is an annual call, not a rolling no-deadline award. The 2025 call closed December 15, 2025 and its recipients were announced February 18, 2026, so the record is now closed while the next call remains unannounced. Yukon’s three records were also checked against current official content, and the Express Micro-grant now carries its exact minimum age of 16.

Earlier passes corrected the Northwest Territories six-month residence threshold and added structured deadline and editorial review dates to every record.

This is a source-backed beta collection, not a claim that every Canadian arts program has been exhaustively catalogued.

## Final territory additions

| Region | Included records | Source-backed points |
|---|---|---|
| Northwest Territories | Small Arts Project Fund; Medium Arts Project Grant; Artist Travel and Touring Fund | The redesigned programs were announced as open on April 17, 2026. The Small and Travel funds are rolling until the annual budget is exhausted. The Medium fund has a current October 31, 2026 intake. Individual and group applicants need at least six months of NWT residence. |
| Nunavut | Commissioner’s Arts Award; Culture and Heritage — Arts Contributions | The 2025 Commissioner’s award is closed; it was an annual $10,000 award and required a third-party nomination. The 2026–27 Main Estimates allocate $325,000 to Arts Contributions, but the current program policy and next intake have not been published, so that route is retained only as a closed, confirmation-required record. |

Primary sources:

- [NWT arts program redesign announcement](https://www.gov.nt.ca/en/newsroom/revamped-nwt-arts-programs-better-fit-artists-applications-open-now)
- [NWT Small Arts Project Fund](https://www.iti.gov.nt.ca/en/services/small-arts-project-fund)
- [NWT Medium Arts Project Grant](https://www.iti.gov.nt.ca/en/services/medium-arts-project-grant)
- [NWT Artist Travel and Touring Fund](https://www.iti.gov.nt.ca/en/services/artist-travel-and-tour-fund)
- [Nunavut Commissioner’s Arts Award — 2025 call](https://commissioner.gov.nu.ca/pdf/2025-10%20NR%20%28Commissioner%29%20Commissioner%27s%20Arts%20Award%202025%20-%20ENG.pdf)
- [Nunavut Commissioner’s Arts Award — 2025 recipients](https://commissioner.gov.nu.ca/pdf/CAA%20recipient%20news%20release%20-%20ENG.pdf)
- [Nunavut 2026–27 Main Estimates](https://www.gov.nu.ca/sites/default/files/documents/2026-05/Main_Estimates_2026_2027_ENG.pdf)

## Nunavut regular arts funding decision

The 2026–27 Nunavut Main Estimates specifically allocate $325,000 to Culture and Heritage’s Arts Contributions line, while the department’s grants and contributions total $8.512 million. The official application form still lists “Arts Contributions” and states an annual January 31 deadline.

However, the available governing policy explicitly sunset on March 31, 2026, and no replacement policy or next call was found. The route has therefore been added only as a **closed, confirmation-required record**, not promoted as open funding. The previous $50,000 cap, two-instalment payment model, applicant categories, and immigration eligibility are historical evidence and must not be presented as current until Culture and Heritage confirms them.

- [Nunavut 2026–27 Main Estimates](https://www.gov.nu.ca/sites/default/files/documents/2026-05/Main_Estimates_2026_2027_ENG.pdf)
- [Expired Culture and Heritage Grants and Contributions Policy](https://www.gov.nu.ca/sites/default/files/documents/2025-02/CH_Grants_and_Contributions_Policy_03_23.pdf)
- [Application form still present on the official site](https://www.gov.nu.ca/sites/default/files/documents/2025-06/APPLICATION_FORM_-_CH_Grants___Contributions__Sept_27__2024__EN.pdf)

## Restricted-source content review

Five official pages return HTTP 403 to the automated link checker. Their current official indexed content and available official PDFs were reviewed separately rather than treating the pages as dead.

| Official source | Verified result |
|---|---|
| Yukon Express Micro-grant | Rolling intake; $100–$5,000; individuals must be at least 16, be citizens or permanent residents, and have one continuous year in Yukon. The age rule was added to matching. |
| Yukon Advanced Artist Award | April 1 and October 1 at 4:30 p.m.; individuals with one continuous year in Yukon and advanced practice; immigration status is not stated publicly and remains confirmation-required. |
| Yukon Touring Artist Fund | March 15, June 15, September 15 and December 15 at 4:30 p.m.; up to $10,000; one continuous year in Yukon; immigration status remains confirmation-required. |
| Nunavut Commissioner’s Arts Award guidelines | Nunavut residence and three nominators are required; it is not a self-application. |
| Nunavut Commissioner’s Arts Award 2025 call | The cycle closed December 15, 2025; the next call is not announced. |

## Structured deadline audit

Every funding record now carries both `deadlineDate` and `nextCheckDate`.

- `deadlineDate` is an official, exact application deadline when one is published. It is explicitly `null` for rolling intake, no-deadline awards, variable sub-calls, and cycles whose next exact date is not yet published. A null is therefore an evidence state, not a missing field.
- `nextCheckDate` is MESURE's editorial review date, not a date asserted by the funder. Upcoming fixed deadlines are checked before submission closes; rolling and unpublished calls are assigned a scheduled source review.

| Deadline state | Records | Audit interpretation |
|---|---:|---|
| Exact official date recorded | 32 | Includes 26 current deadlines and six closed calls with a known past deadline |
| Explicitly no exact date | 14 | Rolling, varies by sub-call, or next cycle not announced |
| Closed records | 10 | Six retain an exact past deadline; four have `null` because no defensible exact date was found |
| Reviews due on 2026-07-23 | 0 | All review dates are later than this audit date |

The audit command fails when a required date is malformed or missing, an active deadline has passed, a review date falls after an active deadline, or a scheduled review is due. A simulated run as of 2026-08-03 correctly flags the four records scheduled for review on August 2, which verifies that stale records are detectable rather than silently retained.

## Automated integrity checks

| Check | Result |
|---|---|
| Funding records | 46 |
| Duplicate IDs | 0 |
| Duplicate names | 0 |
| Missing FR / EN / JA deadline, amount, cash-flow, or eligibility text | 0 |
| Invalid residence, purpose, kind, coverage, or residence-month enum | 0 |
| Missing or malformed official URLs and verification dates | 0 |
| Missing or malformed `deadlineDate` / `nextCheckDate` fields | 0 |
| Exact deadlines / explicit null deadline states | 32 / 14 |
| Active records already past an exact deadline | 0 |
| Source reviews due on the audit date | 0 |
| Type check | Pass |
| Lint | Pass |
| Build and test suite | Pass — 23 tests |

The eligibility tests now separately cover federal, provincial, municipal, non-citizen, collective-composition, six-month NWT, and 12-month province rules. Unknown information continues to resolve to “needs confirmation,” never to a positive eligibility result.

## Official-link audit

`npm run audit:funding-links` checked all 57 unique funding and eligibility URLs using GET requests and redirects.

| Classification | Count | Interpretation |
|---|---:|---|
| Healthy (HTTP 2xx/3xx) | 52 | Reachable during this audit |
| Access-restricted (HTTP 403) | 5 | The known Yukon and Nunavut restrictions are reviewed separately above |
| Confirmed dead (HTTP 404/410) | 0 | No dead funding source found |
| Other HTTP or network error | 0 | None |

## Remaining non-blocking risks

1. Nunavut’s 2026–27 budget confirms an Arts Contributions allocation, but the current policy, cap, payment terms, applicant categories, immigration rules, and next call still need direct departmental confirmation. The record therefore remains closed and confirmation-required.
2. Five official pages restrict automated access. Their content was checked through current official indexed results and official PDFs, but future automated runs cannot detect content changes on those pages.
3. Several local programs do not state immigration status. Those records deliberately return “needs confirmation” for every status rather than inventing citizen or permanent-resident eligibility.
4. Scheduled review dates now make staleness detectable, but they do not fetch or approve new information automatically. Each flagged record still needs an official-source review before its content is changed.

## Reproduction

```bash
npm run typecheck
npm run lint
npm test
npm run audit:funding-data -- --date 2026-07-23
npm run audit:funding-links
```
