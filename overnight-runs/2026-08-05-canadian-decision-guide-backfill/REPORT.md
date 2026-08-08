# Morning Report

## Outcome

- COMPLETE。対象12件を2026-08-05 02:36 JSTまでに公式一次情報で確認し、decisionGuide補完とローカル検証を完了した。
- decisionGuide整備済み件数を98件から110件へ増やした。
- commit、push、deploy、公開、外部連絡は行っていない。
- 完了後、重複実行を防ぐため、この追加バッチ専用の45分間隔オートメーションを削除した。

## Changes

- 夜間台帳と対象12件の作業境界を作成した。
- Wave 1で4件のdecisionGuideを追加し、FringeMTLの2027受付日程を現行公式ページへ更新した。
- Wave 2で4件のdecisionGuideを追加し、Victoria Fringeの根拠URLを現存公式PDFへ修正した。
- Wave 3で4件のdecisionGuideを追加し、計画対象12件をすべて処理した。
- 各decisionGuideに応募可否、応募者負担、主催者支援、ケベックからの判断をfr/en/jaで追加した。
- FringeMTLは2027受付の公開を確認し、`watch`から`upcoming`、締切11月20日、受付再確認8月13日へ更新した。
- Victoria Fringeは旧募集URLが別フェスへ転送されるため、Intrepid Theatreの現存公式2026応募PDFへ差し替えた。
- 固定テストのdecisionGuide対象ID一覧へ12件を追加した。

## Verification

- 開始時のGit状態、保護ファイルSHA-256、データ件数を記録した。
- Wave 1後、JSON構造、25テスト、diff checkが成功した。
- Wave 2後もJSON構造、25テスト、diff checkが成功した。
- Wave 3後もJSON構造、25テスト、diff checkが成功した。
- 最終対象監査: 12件すべてで`access`、`applicantCost`、`organizerSupport`、`quebecAssessment`とfr/en/jaが揃い、欠落0。
- festival radar監査: 221件、ID重複0、タイトル重複0、タイトル＋開催地重複0、期限切れactive/open 0、再確認期限超過0。公式PDFを共有する既存の別用途2レコードのみsource URLが重複。
- funding audit: 75件、errors 0、reviewsDue 0。
- `npm test`: 成功、25/25。vinext build成功。500kB超chunk警告のみ継続。
- `npm run typecheck`: 成功。
- `npm run lint`: 成功。
- `npm run build:pages`: 成功。静的`/`、`/radar`を生成。デプロイはしていない。
- `git diff --check`: 成功。
- 最終Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`（不変）。
- 最終SHA-256: `data/festival-radar.json`=`75277dadb892c63d032eea7e208d8a45191b7a32f27ea6d632117842043cc4b7`、`tests/rendered-html.test.mjs`=`52e748ecc55353be6ed1628c6bf0eb52030e5aafb13ec1f7e8bcd0a6359999d0`。

## Pre-existing State Preserved

- 開始時から存在する`.gitignore`、3データJSON、固定テストのdirty差分を基線として保護する。
- `.gitignore`、`data/funding.json`、`data/opportunities.json`は開始時ハッシュと一致。stage、stash、reset、commitは行っていない。

## Unverified States

- Festival CHAPOは応募ページから現行フォーム・料金・受入条件を取得できず、`watch`のまま。
- 2027募集未公開の案件は、2026年条件を参考として明示し、次回料金・日程を現行事実として扱っていない。
- モバイル実機、公開サイト反映、公開版データは未検証。今回の証拠はローカルデータ・テスト・ビルドまで。

## Blockers

- Festival CHAPOの現行応募条件は公式ページから取得不能。推測せず`watch`を維持した。
- Victoria Fringeの旧公式募集URLは現在別フェスへ転送される。公式PDFへ差し替え、2027条件は推測していない。
- その他の阻害要因なし。

## Morning Decisions

- commit、push、deploy、公開は本人判断を待つ。
- FringeMTLは8月13日18:00 EDTの受付開始時に、参加料金額とEventotron導線を再確認する。
- Festival CHAPOは8月12日に応募ページを再確認する。
- 公開前に全差分レビューと必要ならモバイル実機確認を行う。
