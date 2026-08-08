# Overnight Run Plan

## Objective

2026-08-05 07:30 JSTまでに、MESUREの期限・公式確認日が古い24レコードを一次情報だけで再確認し、確認できた修正をローカルデータへ反映して、公開判断に必要な検証結果と未確認事項を朝の報告へ残す。

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable paths: `data/funding.json`、`data/festival-radar.json`、`data/opportunities.json`、意図した変更に伴う固定テスト、`overnight-runs/2026-08-05-stale-opportunity-refresh/`、通常ビルドの無視対象生成物
- Baseline: branch `main`、HEAD `bbd4609061c329db40d2460d59f6d1554c007822`、`main...github/main`
- Target inventory: funding 12件、festival radar 11件、legacy opportunity 1件。うち期限後もactive/openの阻害要因6件。
- End time: 2026-08-05 07:30 JST。完了前でもこの時刻までに最終検証と報告へ移る。

## Definition of Done

- 対象24件をすべて公式主催者・政府・芸術機関の一次情報で確認し、結果を記録する。閲覧不能や現行情報不明は推測せず未確認として残す。
- 期限切れactive/open 6件を、公式根拠に基づいて更新するか、根拠不足を明記してfail-closedの状態にする。
- 確認できた事実だけをローカルJSONへ反映し、タイトル、開催地、公式URL、IDの重複を増やさない。
- funding audit、テスト、型検査、lint、Pages build、diff checkを実行し、成功・失敗を個別に報告する。
- `STATE.md`と`REPORT.md`を最終化し、台帳validatorを`--final`で通す。

## Allowed Actions

- プロジェクトファイル、Git状態、過去台帳の読み取り。
- 公式主催者・政府・芸術機関の一次情報への読み取り専用アクセス。
- 対象3データファイルと、意図したデータ変更で必要になる固定テスト期待値のローカル編集。
- 既存package scriptsによるaudit、build、test、typecheck、lint。
- この夜間台帳と確認記録の作成・更新。

## Prohibited Actions

- push、deploy、publish、commit、stage、stash、外部メッセージ、購入、アカウント・秘密情報の変更をしない。
- ユーザーデータを削除しない。
- 検索スニペット、まとめサイト、SNS投稿を公募事実の根拠にしない。
- 締切、費用、支援、資格、次回日程を推測で補わない。
- 既存dirty差分を巻き戻さない。対象外ファイルを編集しない。
- モバイル実機、公開反映、デプロイ状態を未検証のまま完了扱いしない。

## Stop Conditions

- 方向を変える判断は朝の本人判断として記録する。
- HEADまたは保護対象ファイルが想定外に変化した場合、書き込みを止め、独立した読み取り作業と報告だけを続ける。
- 一次情報が読めない、矛盾する、または現行情報を確認できない場合、そのレコードは推測せず要確認として記録し、他の対象へ進む。
- 07:00 JST以降は新しい対象へ広げず、検証、差分監査、朝の報告を優先する。

## Team

- Coordinator: Codex root。範囲、波、停止判断、最終報告を担当。
- Explorer: Codex rootが読み取り専用で順次実施。
- Writer: Codex rootのみ。対象ファイルを一度に一波ずつ編集する。
- Verifier: Codex rootが編集後に独立したコマンドと差分確認を順次実施。
- Subagents: 使用しない。

## Verification

- 各波の前後で`git status --short --branch`、HEAD、保護ファイルSHA-256を確認する。
- `npm run audit:funding-data -- --date 2026-08-05`
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build:pages`
- JSON配列、ID・タイトル・開催地・公式URL重複、期限切れactive/open、確認期限超過を監査する。
- `git diff --check`と対象ファイルの差分レビューを行う。
- `python3 /Users/arata/.codex/skills/overnight-project-runner/scripts/validate_run.py overnight-runs/2026-08-05-stale-opportunity-refresh --final`
