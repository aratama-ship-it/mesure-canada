# Overnight Run State

## Status

- Status: COMPLETE
- Last updated: 2026-08-05 02:36 JST
- Current wave: 完了

## Baseline

- Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`
- Branch relation: `main...github/main`
- Pre-existing modified files: `.gitignore`、`data/festival-radar.json`、`data/funding.json`、`data/opportunities.json`、`tests/rendered-html.test.mjs`
- Pre-existing untracked path: `overnight-runs/`
- `.gitignore` SHA-256: `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`
- `data/festival-radar.json` SHA-256: `c0c86f589a0850f182d0dc0731650af21bcdb837ab60eac2eed5aed08ae9b709`
- `data/funding.json` SHA-256: `c36faf17c2d9e58d2b5f3e0b936f59d098cfcb63c6cfb9489fee8b7e04b37d16`
- `data/opportunities.json` SHA-256: `afaa18067d3ffd1264d58cb8844f370a31b09c3a5d0ec05952502c9e378dace4`
- `tests/rendered-html.test.mjs` SHA-256: `bf420c5a0fad95a1e4d4e6048b535c898d5d342e2eda9123fff55865ec506c60`
- Baseline counts: festival radar 221、funding 75、legacy opportunities 6。

## Completed Waves

- 実行境界、対象12件、終了時刻、禁止事項、基線を確定した。
- Wave 1: FringeMTL、Vancouver Fringe、TOHU、Festival CHAPOを確認し、4件のdecisionGuideを追加した。
- FringeMTLの2027受付が公式公開されたため`upcoming`、11月20日締切、8月13日受付開始へ更新した。
- Wave 1後のJSON監査、25テスト、diff checkは成功した。
- Wave 2: Victoria、Edmonton、Ottawa、CAFF Touring Lotteryの4件へdecisionGuideを追加した。
- Victoriaの旧公式URLが別フェスへ転送されたため、現存する公式2026応募PDFへ差し替えた。
- Wave 2後のJSON監査、25テスト、diff checkは成功した。
- Wave 3: Toronto Fringe、Contact ontarois、Halifax Busker、Edmonton StreetFestの4件へdecisionGuideを追加した。
- Wave 3後のJSON監査、25テスト、diff checkは成功した。計画対象12件をすべて処理した。
- Wave 4: 対象12件の4区分・fr/en/jaを監査し、欠落0を確認した。festival radarはID・タイトル・タイトル＋開催地の重複0、期限切れactive/open 0、再確認期限超過0。
- decisionGuide整備済み件数は98件から110件へ増加した。
- funding auditは75件、errors 0、reviewsDue 0。`npm test`は25/25、typecheck、lint、Pages build、`git diff --check`はすべて成功した。
- Git HEAD、`.gitignore`、`data/funding.json`、`data/opportunities.json`は基線から不変。
- 予定より早く完了したため、この追加バッチ用の45分間隔オートメーションを削除した。

## Current Wave

- なし。対象12件の公式確認、decisionGuide補完、全体監査、テスト、ビルドを完了した。

## Next Action

- 朝、`REPORT.md`を確認し、commit、push、deploy、公開を行うか本人が判断する。

## Blockers

- Festival CHAPOの応募ページから現行フォーム・条件を取得できなかった。状態を`watch`に保ち、金銭・支援・資格を推測していない。
- Victoria Fringeの旧募集URLはIncoming Festivalへ転送される。現存公式PDFへsourceを差し替え、2027条件は未確認のままにした。
