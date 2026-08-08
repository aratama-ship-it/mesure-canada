# MESURE Library Expansion State

## Status

- Status: COMPLETE
- Last updated: 2026-07-30 22:08 JST
- Current wave: 5 — final verification and handoff

## Baseline

- Git branch and commit: `main` at `bbd4609061c329db40d2460d59f6d1554c007822`
- Starting library count: 181
- Starting `data/festival-radar.json` SHA-256: `2f67ca7d034fc00cc3a43e96a1a619698bd89d6248086a2487b24032923b4a27`
- Starting `tests/rendered-html.test.mjs` SHA-256: `959dab9e8b7a5b7d297abcfb4c03b2a4d2cb3ec7ff54d2824144ccad8738633c`
- Pre-existing modified files at scheduling time: `.gitignore`, `data/festival-radar.json`, `data/funding.json`, `tests/rendered-html.test.mjs`
- Pre-existing untracked path: `overnight-runs/`
- Protected files for this run: `.gitignore` and `data/funding.json`

## Completed Waves

- Wave 0: Fixed the 181-record baseline, permissions, writable paths, stop time, and validation commands.
- Wave 1: Added three official-source records: WMF Bologna 2027 Call for Buskers, MAIN ST. Fort Worth 2027 Entertainers Application, and National Folk Festival Canberra 2027 circus/street performer route. Library count increased from 181 to 184.
- Wave 1 verification: JSON array/count passed; rebuilt application; all three rendered/data tests passed after classifying two open calls as selection routes rather than unresolved eligibility records; `git diff --check` passed.
- Wave 2: Added two official-source records: CAMPUS PCS Artistic Residencies Programme as a closed international circus-capable cycle to monitor, and RAMDAM Second-Semester 2027 Residency Call as an upcoming multidisciplinary creation/research route. Library count increased from 184 to 186.
- Wave 2 verification: JSON array/count and ID uniqueness passed; the only repeated official URL is the pre-existing explicitly allowed marionnette PDF; fresh build completed; rendered/data tests passed 3/3; `git diff --check` passed.
- Wave 2 exclusion: Did not add the currently open CAMPUS PCS Reclamar Tempo call. The currently indexed programme rules require national-territory residence, so Quebec access could not be established from the official source.
- Wave 3: Added two current official-source records: FRINGE WORLD 2027 Event Registration in Perth as a worldwide open-access, self-produced route, and APAP|NYC 2027 UP NEXT! Artist Pitch Session as a selected international route for U.S.-tour-ready new work. Library count increased from 186 to 188.
- Wave 3 verification: JSON array/count and ID uniqueness passed; fresh build completed; rendered/data tests passed 3/3; `git diff --check` passed.
- Wave 4: Added Sankofa Square 2026–2027 Busker Program in Toronto as a currently open nearby street-performance permit route with official fee, insurance, scheduling and donation rules. Library count increased from 188 to 189.
- Wave 4 verification: JSON array/count and ID uniqueness passed; fresh build completed; rendered/data tests passed 3/3; `git diff --check` passed.
- Wave 4 exclusions: 6Fest Plovdiv, Awaji Art Circus, Buskers Bern and Halifax Busker Festival were already represented in the library. The 6Fest page currently points to an expired 2026 form, so it was not treated as a new 2027 call.
- Wave 5 final verification: library fixed at 189 records, eight above the 181-record baseline. JSON array/count/ID uniqueness passed; application build and all 25 tests passed; lint passed; typecheck passed; `git diff --check` passed; protected hashes remain unchanged.
- Current `data/festival-radar.json` SHA-256: `877679eab6009c2b192c4de11fd9ee64c994201827989f096e78549be77b6763`
- Current `tests/rendered-html.test.mjs` SHA-256: `5511badf301ef81930470cde86755acd82c505c75e34c02c5b85cc5be02fea35`
- Protected hashes remain unchanged: `data/funding.json` `a958e7f06549b2324e9b65224de4136ed610e979748143ec89bdd1b959cb206e`; `.gitignore` `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`.

## Current Wave

- Complete. No further research, editing, publishing or pushing is authorized in this run.

## Next Action

- User review of the local 189-record library. Publishing or pushing requires a separate explicit instruction.

## Blockers

- None.
