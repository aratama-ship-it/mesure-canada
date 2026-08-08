# Morning Report

## Outcome

- COMPLETE。対象24件を2026-08-05 02:20 JSTまでに処理し、ローカル検証まで完了した。
- 公式一次情報を読めた23件は現行事実または現行状態を反映した。MAAA 1件はCloudflare 403のため既存事実を維持し、未確認として再確認日だけを設定した。
- commit、push、deploy、公開、外部連絡は行っていない。
- 完了後、重複作業を避けるため、この夜間作業専用の45分間隔オートメーションを削除した。

## Changes

- 夜間台帳を作成した。
- 第1波で6レコードと固定テストを更新した。公式根拠は`SOURCE_CHECKS.md`へ記録した。
- 第2波でfunding 11件を処理した。10件を現行一次情報で再確認し、MAAA 1件は403として保留した。
- 第3波でfestival radar 7件を再確認し、期限・状態を維持または再確認日を更新した。
- 全体では、NESTの次回締切を12月1日へ、WJFの現行料金期限を10月31日へ更新した。Cairo、Tehran-Mobarak、FAO Incubator、Yaddoは締切後の`watch`へ移した。
- Yaddoの締切を現行公式ページに合わせて8月1日から7月1日へ訂正した。
- 固定テストの期待値を、意図したデータ更新に合わせて更新した。

## Verification

- 開始時のGit状態、保護ファイルSHA-256、データ件数を記録した。
- 第1波後、funding auditは期限エラー0。25テストは25/25成功。
- 第2波後、funding auditはerrors 0、reviewsDue 0。25テストとdiff checkも成功。
- 最終データ監査: funding 75件、festival radar 221件、legacy opportunities 6件。各データセットでID重複0、期限切れactive/open 0、再確認期限超過0。
- source/titleの完全一致重複を確認。タイトル重複は0。複数制度が同じ公式総合ページを共有する既存source URLはあるが、意図した別レコードとしてIDは分離されている。
- `npm test`: 成功、25/25。vinext buildも成功。500kB超chunk警告のみ継続。
- `npm run typecheck`: 成功。
- `npm run lint`: 成功。
- `npm run build:pages`: 成功。最初はサンドボックスのport bind制限で失敗し、同一コマンドを許可済みのサンドボックス外検証で再実行した。デプロイはしていない。
- `git diff --check`: 成功。
- 最終Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`（開始時から不変）。`.gitignore` SHA-256も開始時の`a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`から不変。
- 最終SHA-256: `data/festival-radar.json`=`c0c86f589a0850f182d0dc0731650af21bcdb837ab60eac2eed5aed08ae9b709`、`data/funding.json`=`c36faf17c2d9e58d2b5f3e0b936f59d098cfcb63c6cfb9489fee8b7e04b37d16`、`data/opportunities.json`=`afaa18067d3ffd1264d58cb8844f370a31b09c3a5d0ec05952502c9e378dace4`、`tests/rendered-html.test.mjs`=`bf420c5a0fad95a1e4d4e6048b535c898d5d342e2eda9123fff55865ec506c60`。

## Pre-existing State Preserved

- 開始時から存在する`.gitignore`、`data/festival-radar.json`、`data/funding.json`、`tests/rendered-html.test.mjs`のdirty差分を基線として保護する。
- `.gitignore`は開始時ハッシュと一致し、HEADは不変。stage、stash、reset、commitは行っていない。

## Unverified States

- `maaa-artistic-innovations-next-cycle`の現行公式本文はCloudflare challenge / HTTP 403で未確認。`verifiedAt=2026-07-23`を保持し、`nextCheckDate=2026-08-12`。
- モバイル実機、公開サイトへの反映、公開版データは未検証。今回確認したのはローカルのデータ・テスト・ビルドまで。

## Blockers

- MAAAの公式ページ閲覧不能のみ。その他の計画対象は処理済み。

## Morning Decisions

- commit、push、deploy、公開は本人判断を待つ。
- MAAAを8月12日までに別回線または公式窓口で再確認するか判断する。
- 公開前に差分レビューと必要ならモバイル実機確認を行う。
