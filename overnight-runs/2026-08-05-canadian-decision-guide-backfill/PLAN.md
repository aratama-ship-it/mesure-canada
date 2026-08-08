# Overnight Run Plan

## Objective

2026-08-05 07:30 JSTまでに、MESUREのカナダ案件のうち期限が近く`decisionGuide`未整備の12件を公式一次情報で再確認し、応募可否、応募者負担、主催者支援、ケベックからの判断をフランス語・英語・日本語でローカルデータへ補完する。

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable paths: `data/festival-radar.json`、意図した変更に必要な`tests/rendered-html.test.mjs`、`overnight-runs/2026-08-05-canadian-decision-guide-backfill/`、通常ビルドの無視対象生成物。
- Target IDs: `fringemtl-2027-watch`、`vancouver-fringe-2027-upcoming`、`tohu-research-creation-residencies-watch`、`festival-chapo-next-watch`、`victoria-fringe-2027-watch`、`edmonton-fringe-2027-upcoming`、`ottawa-fringe-2027-watch`、`caff-touring-lottery-watch`、`edmonton-street-performers-2027-watch`、`halifax-busker-festival-2027-watch`、`contact-ontarois-2027-watch`、`toronto-fringe-2027`。
- Baseline: branch `main`、HEAD `bbd4609061c329db40d2460d59f6d1554c007822`、`main...github/main`。開始時から`.gitignore`、`data/festival-radar.json`、`data/funding.json`、`data/opportunities.json`、`tests/rendered-html.test.mjs`がmodified、`overnight-runs/`がuntracked。
- End time: 2026-08-05 07:30 JST。07:00以降は新規対象に広げず最終検証を優先する。

## Definition of Done

- 12件をすべて公式主催者、自治体、業界団体の一次情報で確認し、確認不能な項目を推測しない。
- 各対象へ`decisionGuide.access`、`applicantCost`、`organizerSupport`、`quebecAssessment`をfr/en/jaで追加する。既存の確認済み事実に矛盾があれば、根拠を記録して期限・状態も更新する。
- ID、タイトル、開催地、公式URLの完全一致重複を増やさず、期限切れopenを作らない。
- funding audit、データ監査、テスト、typecheck、lint、Pages build、diff checkを成功させるか、正確な阻害要因を報告する。
- `STATE.md`と`REPORT.md`を最終化し、台帳validatorを`--final`で通す。

## Allowed Actions

- プロジェクトファイル、Git状態、既存データ、過去台帳の読み取り。
- 対象12件の公式ページ、公式PDF、公式応募要項への読み取り専用アクセス。
- 対象12件の`decisionGuide`と、公式根拠で必要な状態・確認日・次回確認日のローカル編集。
- 意図したデータ変更に伴う固定テストのローカル編集。
- 既存package scriptsによるaudit、build、test、typecheck、lint。
- この夜間台帳と公式確認記録の作成・更新。

## Prohibited Actions

- push、deploy、publish、commit、stage、stash、外部メッセージ、購入、アカウント・秘密情報の変更をしない。
- ユーザーデータを削除しない。既存dirty差分を巻き戻さない。
- 検索スニペット、まとめサイト、SNS投稿を公募事実の根拠にしない。
- 締切、費用、支援、資格、次回日程、助成適合を推測で補わない。
- 対象外レコードや対象外ファイルを編集しない。
- モバイル実機、公開反映、デプロイ状態を証拠なしに完了扱いしない。

## Stop Conditions

- 方向を変える判断は朝の本人判断として記録する。
- HEADまたは保護対象ファイルが想定外に変化した場合、書き込みを止め、読み取り作業と報告だけを続ける。
- 一次情報が読めない、矛盾する、または現行情報が不明な場合、その項目をunknown/要確認として記録し、他の対象へ進む。
- 07:00 JST以降は検証、差分監査、朝用報告を優先する。

## Team

- Coordinator: Codex root。範囲、波、停止判断、最終報告を担当。
- Explorer: Codex rootが読み取り専用で順次実施。
- Writer: Codex rootのみ。1波4件を上限に編集する。
- Verifier: Codex rootが各波後と最終段階に独立した監査を実施。
- Subagents: 使用しない。

## Verification

- 各波の前後で`git status --short --branch`、HEAD、保護ファイルSHA-256を確認する。
- `jq -e 'type == "array"' data/festival-radar.json`
- 対象12件の`decisionGuide`構造、fr/en/ja、確認日、状態を監査する。
- ID、タイトル、開催地、公式URL重複、期限切れactive/open、再確認期限超過を監査する。
- `npm run audit:funding-data -- --date 2026-08-05`
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build:pages`
- `git diff --check`
- `python3 /Users/arata/.codex/skills/overnight-project-runner/scripts/validate_run.py overnight-runs/2026-08-05-canadian-decision-guide-backfill --final`
