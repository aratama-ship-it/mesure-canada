# Overnight Run Plan

## Objective

Expand the MESURE international opportunity radar from 245 to at least 300 records by 08:00 JST on 2026-08-06, using official organizer, public-agency, or arts-institution sources only.

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable paths: `data/festival-radar.json`, `README.md`, `tests/rendered-html.test.mjs`, and this run directory.
- Baseline: branch `main`, commit `e61ce50aac51b3fcf45233cb9018f57d04ad5559`; radar 245 records (69 open, 34 upcoming, 142 watch).
- Protected baseline hashes: `.gitignore` `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`; `data/funding.json` `c36faf17c2d9e58d2b5f3e0b936f59d098cfcb63c6cfb9489fee8b7e04b37d16`.

## Definition of Done

- 300 or more radar records with title, city, official source URL, status, and practical FR/EN/JA decision guide.
- No duplicate ID, normalized title/city, or source URL other than an explicitly pre-existing shared source.
- No past-due entry remains `open`; unknown current terms remain `watch` or `verify`.
- Validation, tests, lint, typecheck, and diff checks pass.
- Each validated batch is committed, pushed, and publicly deployed under the prior user authorization for this MESURE series; the final public and custom-domain pages are checked.

## Allowed Actions

- Read project files, existing ledger records, and official web sources.
- Add or refresh evidence-bounded radar records and related exact count tests.
- Use official organizer, municipality, ministry, festival, or arts-institution pages only.
- Commit, push, and deploy a validated MESURE batch. This is explicitly authorized by the user in the preceding conversation.
- Use recurring thread heartbeats until the morning cutoff.

## Prohibited Actions

- Do not delete user data or alter pre-existing `overnight-runs/` contents.
- Do not edit `.gitignore` or `data/funding.json`.
- Do not infer eligibility, cost, support, technical capacity, funding, or current status from a directory, search snippet, social post, or stale source.
- Do not send messages, make purchases, change DNS, change secrets, or change access settings.
- Do not use subagents; one sequential writer owns the canonical dataset.

## Stop Conditions

- Stop record edits at 08:00 JST and perform final verification and reporting only.
- Record any authority, source, source-access, or baseline blocker precisely; continue independent official-source research when possible.
- Stop an individual candidate when title, city, official URL, deadline/status, eligibility, cost, or support cannot be verified sufficiently.

## Team

- Coordinator: Codex root, scope, waves, stop decisions, integration and final report.
- Explorer: Codex root, sequential read-only official-source discovery and candidate selection.
- Writer: Codex root, the only editor of `data/festival-radar.json` and related count files.
- Verifier: Codex root, independent post-edit audit, tests, deployment and public-domain checks.

## Verification

- JSON parse; ID, normalized title/city, source URL, and expired-open audits.
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run audit:funding-data`, and `git diff --check`.
- On each release: check both the Sites URL and `https://mesure.art-monosashi.com/radar` for the rendered row count.
- `python3 /Users/arata/.codex/skills/overnight-project-runner/scripts/validate_run.py overnight-runs/2026-08-06-mesure-radar-to-300` before waves and with `--final` at close.
