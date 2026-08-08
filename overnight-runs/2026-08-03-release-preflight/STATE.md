# Run State

## Status

- Status: COMPLETE
- Updated: 2026-08-03T01:13:00+09:00

## Baseline

- Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`
- 既存変更: `.gitignore`、`data/festival-radar.json`、`data/funding.json`、`tests/rendered-html.test.mjs`
- 既存未追跡: `overnight-runs/`
- `data/festival-radar.json` SHA-256: `567302d55a854531e2dd6c17388b9d27357482804da597aedc71a338331fcb57`
- `data/funding.json` SHA-256: `a958e7f06549b2324e9b65224de4136ed610e979748143ec89bdd1b959cb206e`

## Completed Waves

- 対象、禁止事項、既存dirty状態を確定。
- 資金データ監査、型、lint、通常ビルド、25テスト、Pages buildを実行。
- 助成公式リンク87件を読み取り確認。
- 公開176件版とローカル221件版の差を確認。
- 期限切れopen 5件と再確認期限超過21件を特定。

## Current Wave

- なし。リリース前監査は完了。

## Next Action

- 公式ソースを再確認し、期限・状態を更新したうえで全検証を再実行する。

## Blockers

- 現行テストは25件中1件失敗。期限切れopenと再確認期限超過があるため公開不可。
