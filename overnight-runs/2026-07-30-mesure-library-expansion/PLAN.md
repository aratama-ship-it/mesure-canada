# MESURE Library Expansion Plan

## Objective

2026年7月30日17:00〜22:00 JSTに、品質欄やレポートの量ではなく、MESURE Canadaで検索・表示される公募ライブラリ本体を公式一次情報に基づいて増やす。

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/app-dev/quebec-opportunity-match`
- Writable paths:
  - `data/festival-radar.json`
  - `tests/rendered-html.test.mjs`
  - `overnight-runs/2026-07-30-mesure-library-expansion/STATE.md`
  - `overnight-runs/2026-07-30-mesure-library-expansion/REPORT.md`
- Baseline:
  - Branch: `main`
  - Commit: `bbd4609061c329db40d2460d59f6d1554c007822`
  - Library count: 181 records
  - `data/festival-radar.json` SHA-256: `2f67ca7d034fc00cc3a43e96a1a619698bd89d6248086a2487b24032923b4a27`
  - `tests/rendered-html.test.mjs` SHA-256: `959dab9e8b7a5b7d297abcfb4c03b2a4d2cb3ec7ff54d2824144ccad8738633c`

## Definition of Done

- 公式一次情報でタイトル、開催地、募集状態、締切または未公表状態、対象、公式URL、確認日を確認できる新規公募を、既存181件との重複を避けてライブラリへ追加する。
- 追加レコードにはフランス語・英語・日本語の表示文と、ケベックからの直接応募性を判断できる情報を付ける。
- 22:00の最終回にビルド、全テスト、lint、typecheck、JSON整合性、`git diff --check`を完了し、結果と件数差分を報告する。

## Allowed Actions

- Read project files and applicable instructions.
- 公式主催者、自治体、芸術機関、フェスティバル自身の一次情報を検索・閲覧する。
- `data/festival-radar.json`へ新規レコードを追加し、`tests/rendered-html.test.mjs`へ必要最小限の回帰テストを追加する。
- 各回、JSON構文、重複、必須項目、対象条件を検証する。
- 各回、STATEとREPORTを更新する。

## Prohibited Actions

- Do not push, deploy, publish, send external messages, purchase, or change secrets.
- Do not delete user data.
- `.gitignore`と`data/funding.json`を変更しない。
- 品質欄や助成金データの件数を増やすことを主目的にしない。
- SNS、まとめサイト、検索スニペットだけを根拠にレコードを追加しない。
- 締切、支援、資格を推測で補わない。
- サブエージェントを起動しない。

## Stop Conditions

- Record direction-changing decisions for the user.
- Stop unsafe work if the baseline changes unexpectedly.
- 同じタイトルと開催地、または同一公募ページの既存レコードを見つけた場合は追加しない。
- 公式情報だけでは主要項目を確認できない候補は、実装せず未確認事項としてREPORTへ残す。
- 22:00 JST以降は新規調査・新規追加を止めて最終検証へ移る。

## Team

- Coordinator: 単独で範囲、各波、停止判断、最終報告を管理する。
- Explorer: 公式一次情報の探索と既存レコードとの重複確認を順番に行う。
- Writer: この実行中の単独エージェントだけが対象ファイルを編集する。
- Verifier: 書き込み後に独立したコマンドで構文、回帰、差分を検証する。

## Verification

- `jq -e 'type == "array"' data/festival-radar.json`
- `node --test tests/rendered-html.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `git diff --check`
- `python3 /Users/arata/.codex/skills/overnight-project-runner/scripts/validate_run.py overnight-runs/2026-07-30-mesure-library-expansion --final`
