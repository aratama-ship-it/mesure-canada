# Morning Report

## Outcome

- In progress. Target: at least 350 official-source radar records by 08:00 JST. Baseline: 300 (92 open, 34 upcoming, 174 watch).

## Changes

- Run ledger created; no canonical data changed in setup.
- Wave 1 added three official-organizer records, reaching 303 (92 open, 34 upcoming, 177 watch). Art Center NEW's 2026 Asia-only route is marked `not_direct` for a standalone Quebec applicant; FAAM has a documented no-nationality/no-residence-restriction route to watch; Studio 88 is recorded as possible but self-funded for a Quebec applicant. Each has complete FR/EN/JA decision guidance, with published support separated from items requiring confirmation.

## Verification

- Baseline branch, commit, radar counts, protected hashes, and pre-existing untracked state captured before the first data wave.
- At 00:22 JST, added-record title/city/source collision and cross-language character checks passed; `npm test` 26/26, lint, typecheck, funding-data audit, `git diff --check`, and both protected hashes passed.
- Wave 1 was committed, pushed, and deployed as Sites version 61. At 00:25 JST, both the Sites URL and `https://mesure.art-monosashi.com/radar` externally rendered 303 rows.
- Wave 2 added one public-agency official source, reaching 304 (92 open, 34 upcoming, 178 watch): Sistema Creación × CALQ's Canada–Mexico exchange. Its guide correctly preserves CALQ admission and Mexican host/budget details as `verify`; no unsupported direct-application claim is made. At 00:30 JST its duplicate, language-separation and full project checks passed.
- Wave 2 was committed, pushed, and deployed as Sites version 62. At 00:34 JST, both public radar URLs externally rendered 304 rows.
- Wave 3 added three Middle East institutional opportunities, reaching 307 (92 open, 34 upcoming, 181 watch). Beirut Art Center, Culture Resource / Wijhat, and Hayy Jameel are all correctly marked `not_direct` for a standalone Quebec applicant because their verified cycles require Lebanon, the Arab region, or Makkah-region residence respectively. At 00:42 JST, record-specific checks and all project validation passed.
- Wave 3 was committed, pushed, and deployed as Sites version 63. At 00:47 JST, both public radar URLs externally rendered 307 rows.
- Wave 4 added STIAS's direct global 2028 Artist-in-Residence Fellowship, reaching 308 (93 open, 34 upcoming, 181 watch). Its published October 31 deadline, no-origin restriction and specialist-studio limitation are explicitly captured; artist-stream budget coverage remains `verify`. At 01:00 JST, record-specific checks and all project validation passed.
- Wave 4 was committed, pushed, and deployed as Sites version 64. At 01:05 JST, both public radar URLs externally rendered 308 rows.
- Wave 5 added three Asia official-organizer records, reaching 311 (94 open, 34 upcoming, 183 watch). Rimbun Dahan and ITI retain their non-Quebec territorial gates; Sam Rit is a live worldwide lead with all unknown financial and immigration terms marked `verify`. At 01:23 JST, record-specific checks and all project validation passed.
- Wave 5 was committed, pushed, and deployed as Sites version 65. After CDN propagation, both public radar URLs externally rendered 311 rows at 01:31 JST.
- Wave 6 added nine official-source records, reaching 320 (94 open, 34 upcoming, 192 watch): eight distinct Halaqat host residencies documented by the Goethe-Institut’s official call PDF (Fondation Hiba, two Goethe-Institut Cairo tracks, Drum Jam, Queens Collective, Irtijal–Tassarout, Amalgam and Hunna), plus Esplanade Singapore’s international performing-arts research residency. Halaqat’s published Arab-region/EU base gate is preserved as `not_direct` from Quebec; Esplanade remains a direct international next-cycle route. At 02:44 JST, record-specific collision and FR/EN/JA checks, `npm test` (26/26), lint, typecheck, funding-data audit, whitespace and protected hashes all passed. Publication is the next step.
- Wave 6 was committed as `32c9053`, pushed, and deployed as Sites version 66. After the short CDN transition, both public radar URLs externally rendered 320 rows at 02:46 JST.
- Wave 7 added three official-organizer records, reaching 323 (96 open, 34 upcoming, 193 watch): the live AiRViNe/Asterisk Kyoto Southeast Asian exchange, The Africa Institute’s Africa-and-diaspora creative-writing fellowship, and the live Espace Brownstone/Art in Latin America Paris residency. Regional gates are recorded as `not_direct`; The Africa Institute route stays `verify` because project relevance remains decisive. At 02:58 JST, record-specific collision and FR/EN/JA checks plus all project validation passed. Publication is the next step.
- Wave 7 was committed as `14d1694`, pushed, and deployed as Sites version 67. Both public radar URLs externally rendered 323 rows at 02:59 JST.
- Wave 8 added three official-source records, reaching 326 (97 open, 34 upcoming, 195 watch): Kota 2026 (Cité internationale des arts × Institut français d’Indonésie), Andes~Sena 2026 (Cité internationale des arts × Chile), and G.A.S. Foundation’s African & Diaspora Farm Fellowship 2026. Kota remains live through August 30 but has a seven-year Indonesia residence/practice gate; Andes~Sena and G.A.S. are next-call watches. The G.A.S. record does not infer the official but undefined diaspora category for a Quebec applicant. At 03:15 JST, record-specific collision and FR/EN/JA checks, `npm test` (26/26), lint, typecheck, funding-data audit, whitespace and protected hashes all passed. Publication is the next step.
- Wave 8 was committed as `603e9fa`, pushed, and deployed as Sites version 68. Both public radar URLs externally rendered 326 rows at 03:22 JST.
- Wave 9 added three distinct official G.A.S. Fellowship tracks, reaching 329 (97 open, 34 upcoming, 198 watch): Nigerian Emerging Visual Artists, Nigerian Mid-Career Arts Writer, and U.S.-Based Artists Farm Fellowships. Each is a next-call watch with a separate PDF page anchor. The records preserve nationality/residence gates; only the Nigerian-national writer route is `conditional` for a qualifying person already based in Quebec. At 03:35 JST, record-specific collision and FR/EN/JA checks plus all project validation passed. Publication is the next step.
- Wave 9 was committed as `d7fb92d`, pushed, and deployed as Sites version 69. At 03:40 JST, the custom domain’s direct route and the Sites domain cache-busted route both rendered 329 rows; their reciprocal CDN variants retained a 326-row cache, so propagation needs a plain-route recheck in the next wave.
- At 03:55 JST both plain public `/radar` endpoints rendered 329 rows, closing the Wave 9 cache-propagation check.
- Wave 10 added three official-source records, reaching 332 (98 open, 34 upcoming, 200 watch): live Ibermúsicas support for music creation/research residencies, Iberescena’s next-call performing-arts support, and RAMDAM’s next-call Extended Possibilities residency. Territorial routes and unresolved full-rule conditions remain explicit. At 03:55 JST, record-specific collision and FR/EN/JA checks plus all project validation passed. Publication is the next step.
- Wave 10 was committed as `0351dc8`, pushed, and deployed as Sites version 70. At 04:00 JST both cache-busted radar endpoints rendered 332 rows; an earlier custom-domain cache variant still showed 329, so plain-route propagation needs another check.
- At 04:15 JST both plain public `/radar` endpoints rendered 332 rows, closing the Wave 10 cache-propagation check.
- Wave 11 added four official Goethe-Institut records, reaching 336 (99 open, 34 upcoming, 203 watch): the live Africa–Europe Mobility Grants and three distinct FILE NOT FOUND options hosted by The ArQuives in Toronto, China Modern Art Archive in Beijing, and South African History Archive in Johannesburg. Host-level sources preserve durations, access limits, collections and support separately. At 04:20 JST, record-specific collision and FR/EN/JA checks plus all project validation passed. Publication is the next step.
- Wave 11 was committed as `bca2320`, pushed, and deployed as Sites version 71. Both cache-busted public radar endpoints rendered 336 rows at 04:22 JST.
- Wave 12 added three official FILE NOT FOUND host choices, reaching 339 (99 open, 34 upcoming, 206 watch): Acervo Bajubá in São Paulo, Kurdistan Center for Arts & Culture in Erbil, and MNAC in Lisbon. The common global call funding is kept separate from each host’s own research focus, timing and access. At 04:40 JST, record-specific collision and FR/EN/JA checks plus all project validation passed. Publication is the next step.
- Wave 12 was committed as `0ef9bcd`, pushed, and deployed as Sites version 72. Both cache-busted public radar endpoints rendered 339 rows at 04:42 JST.
- Wave 13 added four official Goethe-Institut FILE NOT FOUND host choices, reaching 343 (99 open, 34 upcoming, 210 watch): documenta archiv in Kassel, Arsenal Filminstitut in Berlin, Imagine IC & Need for Legacy in Amsterdam, and VEHA Archive across Bialystok / Bielsk Podlaski. The global eligibility, payment and tax terms are kept distinct from source-specific collection fit, duration, workspace and accessibility information. At 04:55 JST, record-specific collision and FR/EN/JA checks, `npm test` (26/26), lint, typecheck, funding-data audit, whitespace and protected hashes all passed. Publication is the next step.
- Wave 13 was committed as `79cf1d3`, pushed, and deployed as Sites version 73. At 05:03 JST, both cache-busted public radar endpoints rendered 343 rows.
- Wave 14 reached the 350-record target by adding seven official-organizer/public-arts records: Goethe-Institut Project Space; Networks of Belonging; Deniz Villaları; Confluence of Myths; Every Body in Motion; Truth Lab; and Goethe-Institut Gallery. The record set retains every published territorial gate and marks unresolved international application mechanics and costs `verify` rather than creating a Quebec route. At 05:28 JST, record-specific collision and FR/EN/JA checks, `npm test` (26/26), lint, typecheck, funding-data audit, whitespace and protected hashes all passed. Publication is the next step.
- Wave 14 was committed as `16ca090`, pushed, and deployed as Sites version 74. At 05:32 JST, both cache-busted public radar endpoints rendered 350 rows.
- At 05:56 JST, both normal public `/radar` endpoints also rendered 350 rows.

## Pre-existing State Preserved

- The existing untracked `overnight-runs/` directory is preserved. Only this run subdirectory is created.

## Unverified States

- Future official calls, external payment, visas, detailed technical specifications, and any organizer terms not published on official pages remain unverified unless a record states otherwise.

## Blockers

- None at setup.

## Morning Decisions

- None at setup.
