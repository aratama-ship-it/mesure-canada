# Overnight Run State

## Status

- Status: COMPLETE
- Last updated: 2026-08-05 02:20 JST
- Current wave: 完了

## Baseline

- Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`
- Branch relation: `main...github/main`
- Pre-existing modified files: `.gitignore`、`data/festival-radar.json`、`data/funding.json`、`tests/rendered-html.test.mjs`
- Pre-existing untracked path: `overnight-runs/`
- `.gitignore` SHA-256: `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`
- `data/festival-radar.json` SHA-256: `567302d55a854531e2dd6c17388b9d27357482804da597aedc71a338331fcb57`
- `data/funding.json` SHA-256: `a958e7f06549b2324e9b65224de4136ed610e979748143ec89bdd1b959cb206e`
- `tests/rendered-html.test.mjs` SHA-256: `4efb084ccc4718f2c221c7ce6ef5a932aea010b548d77341a1e425dde44f3de5`
- Baseline counts: funding 75、festival radar 221、legacy opportunities 6。
- 2026-08-05 audit inventory: funding reviews due 12、festival radar reviews due 11、legacy expired-open 1。期限後もactive/openは計6。

## Completed Waves

- 実行境界、終了時刻、禁止事項、対象24件を確定した。
- 開始時のGit状態、ファイルハッシュ、データ件数を保存した。
- Wave 1: 期限切れactive/open 6件を一次情報で確認した。
- NESTを12月1日へ、WJFを10月31日の現行料金区切りへ更新した。
- Cairo、Tehran-Mobarak、FAO Incubator、Yaddoを終了済み`watch`へ移した。Yaddoの公式締切を7月1日に訂正した。
- funding auditは期限エラー0、再確認期限超過11件。25テストは25/25成功した。
- Wave 2: funding 11件を再確認した。10件は現行公式ページで確認し、確認日・次回確認日を更新した。
- `maaa-artistic-innovations-next-cycle`は公式ページがCloudflare 403のため事実を更新せず、成功済み確認日を保持した。
- Wave 2後のfunding auditはerrors 0、reviewsDue 0。25テストは25/25成功した。
- Wave 3: festival radar 7件を現行公式ページで確認し、確認日と次回確認日を更新した。
- Imaginariusは締切後`watch`を維持。Sundance、CubaDupa、Toronto、Waterloo、Ottawaは現行導線に沿う状態を維持した。
- Nelson Fringeは開始日が明記されないため`upcoming`を維持し、短期再確認にした。
- Wave 4: funding 75件、festival radar 221件、legacy opportunities 6件を再監査し、ID重複0、期限切れactive/open 0、再確認期限超過0を確認した。
- `npm test`は25/25、typecheck、lint、Pages build、`git diff --check`はすべて成功した。
- Git HEADと`.gitignore`の基線ハッシュが不変であることを確認した。
- 予定より早く完了したため、45分間隔の再開オートメーションを削除した。

## Current Wave

- なし。計画した24件の確認、ローカル反映、最終検証、朝用報告を完了した。

## Next Action

- 朝、`REPORT.md`の差分概要とMAAA未確認を確認し、commit、push、deploy、公開を行うか本人が判断する。

## Blockers

- WJF公式ページは通常のブラウザー抽出で失敗したため、読み取り専用curlで本文を確認した。
- MAAA公式ページはCloudflare challenge / HTTP 403で本文を確認できなかった。既存事実は変更していない。
- `build:pages`はサンドボックス内ではTurbopackのローカルポートbindが拒否されたが、同一コマンドの読み取り・ビルド検証をサンドボックス外で再実行して成功した。
