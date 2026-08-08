# Overnight Run Plan

## Objective

2026年7月30日12:00 JSTごろまで、MESURE Canadaの公募・助成データを公式一次情報だけで再確認し、追加価値の高い情報を増やしながら、期限・応募資格・出典・重複・データ整合性を改善する。

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/app-dev/quebec-opportunity-match`
- Writable paths: `data/`, `tests/`, `scripts/`, `README.md`, `overnight-runs/2026-07-30-mesure-data-quality/`
- Baseline: branch `main`, commit `bbd4609`
- Baseline records: opportunities 6, festival radar 176, funding 75
- Pre-existing dirty state: `.gitignore` has an uncommitted iCloud conflict-copy exclusion; preserve it unchanged.

## Definition of Done

- `node scripts/audit-funding-data.mjs --date=2026-07-30` reports 0 errors and 0 due reviews.
- High-priority open/upcoming records and near-term deadlines are checked against official sources.
- New records are added only when official evidence supports the title, route, status, deadline state, eligibility boundary, source URL, and verification date.
- Duplicate IDs, malformed URLs, broken funding references, invalid dates, unsupported enums, and stale open statuses are checked.
- All local tests and relevant audits pass.
- `REPORT.md` separates verified changes, candidates not added, blockers, and unverified publication state.

## Allowed Actions

- Read project files and applicable instructions.
- Edit the scoped local files with one writer.
- Browse official organizer, funder, government, and network sources.
- Run repository audits, tests, lint, type checking, and builds.
- Create local commits containing only the named MESURE files.

## Prohibited Actions

- Do not push, deploy, publish, send external messages, purchase, or change secrets.
- Do not delete user data.
- Do not modify or stage the pre-existing `.gitignore` change.
- Do not infer eligibility, deadlines, or funding links from search snippets, social posts, or prior-year wording.
- Do not make product-direction or large UI/schema changes without the user.

## Stop Conditions

- Stop new research at 11:30 JST and reserve the remaining time for verification and reporting.
- Record direction-changing decisions for the user.
- Stop unsafe work if the baseline changes unexpectedly.
- Continue other independent tasks when one source is blocked.

## Team

- Coordinator: current Codex task; scope, waves, integration, report
- Explorer: current Codex task in read-only research phases
- Writer: current Codex task only
- Verifier: current Codex task in a separate verification phase
- No subagents are authorized for this run.

## Verification

- `node scripts/audit-funding-data.mjs --date=2026-07-30`
- `npm run audit:funding-links`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `git diff --check`
- Compare final record counts, hashes, and status with the baseline.
