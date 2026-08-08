# Overnight Run Plan

## Objective

Increase MESURE's public official-source opportunity radar from 300 to at least 350 records by 08:00 JST on 2026-08-08, without weakening source, duplicate, or FR/EN/JA decision-guide standards.

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable canonical path: `data/festival-radar.json`; count assertions and README only when the total changes.
- Run-ledger path: `overnight-runs/2026-08-08-mesure-radar-to-350/`.
- Baseline: `main` at `cb31462476f1b4b42301335d9e59518a8237e47a`; 300 records (92 open, 34 upcoming, 174 watch). Pre-existing untracked `overnight-runs/` content is preserved.

## Definition of Done

- At least 350 unique radar records are present, each added record has an official organizer or institution source and complete French, English, and Japanese decision guidance.
- Title/city/source URL duplicate checks, JSON parsing, `npm test`, lint, typecheck, funding audit, and whitespace checks pass.
- Under the user's existing MESURE publication authorization, every fully validated batch is committed, pushed, deployed, and externally checked on the Sites URL and custom domain.
- At 08:00 JST, data edits stop; the ledger is finalised as `COMPLETE`, `PARTIAL`, or `BLOCKED` and passes `validate_run.py --final`.

## Allowed Actions

- Read project files and official organizer, public-agency, or arts-institution pages.
- Add only fully evidenced radar records; keep unknown eligibility, costs, and support as `verify` rather than inferring them.
- Commit, push, deploy, and verify fully validated MESURE batches under the user's established publication authorization.

## Prohibited Actions

- Do not edit `.gitignore` or `data/funding.json`.
- Do not delete user data or pre-existing `overnight-runs/` content.
- Do not use directories, aggregators, media reports, or social posts as record evidence.
- Do not add data after 08:00 JST or make unsupported eligibility, fee, or support claims.

## Stop Conditions

- Stop canonical data work at 08:00 JST, on a protected-hash mismatch, or if the target baseline changes unexpectedly.
- Record any decision requiring new authority; otherwise continue a bounded official-source wave.

## Team

- Coordinator, explorer, writer, and verifier: one agent, serialized. No concurrent canonical-data writers.

## Verification

- Per wave: JSON parse; added-record ID/title-city/source duplicate and FR/EN/JA checks; `npm test`; `npm run lint`; `npm run typecheck`; `npm run audit:funding-data`; `git diff --check`; protected hashes.
- Publication: successful Sites deployment plus external radar-row counts on both public URLs.
