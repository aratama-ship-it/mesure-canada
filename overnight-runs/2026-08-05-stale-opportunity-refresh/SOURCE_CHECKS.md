# Source Checks

確認日: 2026-08-05 JST

## Wave 1 — 期限切れactive/open

### `nefa-nest-fy27`

- 公式: https://www.nefa.org/NEST
- 結果: `open`相当を維持。公式ページは年3回、8月・12月・4月の最初の営業日が締切と明記。8月3日終了後の次回は2026年12月1日。
- 反映: `deadlineDate=2026-12-01`、`nextCheckDate=2026-11-24`、確認日更新。

### `cairo-film-2026`

- 公式: https://www.ciff.org.eg/en/media/news/ciff-announces-the-opening-of-submissions-for-its-47th-edition
- 結果: 世界向け応募は2026年8月1日に終了。第47回は11月11〜20日。
- 反映: `status=watch`。過去締切を保持し、次回を推測しない。

### `tehran-mobarak-puppet-festival-2026-open`

- 公募掲載元: https://assitej-international.org/2026/07/06/open-call-for-21st-tehran-mobarak-international-puppet-festival/
- 添付公募: https://assitej-international.org/wp-content/uploads/2026/07/open-call-for-21st-tehran-mobarak.pdf
- 結果: Dramatic Arts Centre of Iranの第21回公募は2026年8月1日に終了。フェスティバルは10月18〜23日。
- 反映: `status=watch`。遅延応募・次回日程を推測しない。

### `festival-animated-objects-incubator-2026-28-open`

- 公式: https://www.puppetfestival.ca/incubator-application
- 結果: 2026–28 Incubatorは2026年8月2日に終了。カルガリー／Moh’kinstsis周辺在住条件は継続掲載。
- 反映: `status=watch`。次回版の存在を推測しない。

### `yaddo-performance-residency-nov-2026-jun-2027-open`

- 公式: https://yaddo.org/apply/
- 結果: 公式ページは、11月〜翌6月開始分のSummer cycle締切を2026年7月1日23:59 ETと掲載。既存記録の8月1日は現行一次情報と不一致。次のWinter cycleは11月1日〜12月20日だが対象滞在期間が別。
- 反映: `status=watch`、`deadlineDate=2026-07-01`、`nextCheckDate=2026-11-01`。

### `wjf-23-seattle`

- 公式: https://www.thewjf.com/wjf23/
- 結果: 受付は継続中。2026年8月1日〜10月31日は300米ドル、11月1日以降と当日受付は500米ドル。見学は無料。
- 反映: `status=open`を維持し、現行の期限を`2026-10-31`へ更新。

## Wave 1 Verification

- funding audit: 構造・期限エラー0。再確認期限超過は12件から11件へ減少。
- tests: 固定期待値更新後25/25成功。
- build: `npm test`内のvinext build成功。500kB超chunk警告は継続。

## Wave 2 — funding再確認期限超過11件

### 現行内容を確認した10件

- `tac-music`: https://torontoartscouncil.org/grants/music-creation-and-recording/ — 2026年9月3日締切、3区分の上限、Toronto居住・資格条件を確認。
- `afa-theatre-individual-project-2026`: https://www.affta.ab.ca/funding/find-funding/theatre-individual-project-funding — 2026年9月1日／2027年3月1日、最大18,000 CAD、Alberta居住・全共同所有者条件を確認。
- `afa-dance-individual-project-2026`: https://www.affta.ab.ca/funding/find-funding/dance-individual-project-funding — Theatre版と同じ締切・上限・居住条件をDanceページで確認。
- `mac-travel-professional-development-2026`: https://artscouncil.mb.ca/grants/travel-professional-development/ — 隔月1日締切、次回9月1日、最大1,000 CADを確認。
- `artsnb-artist-in-residence-2026`: https://artsnb.ca/web/programs/artist-in-residence/ — Upcoming Deadlinesに2026年9月1日を確認。
- `arts-midwest-gig-fund-next-watch`: https://artsmidwest.org/get-support/gig-fund/applying/ — 公式ページは引き続き2025年9月29日終了と表示。新日程なしのため`closed`維持。
- `jazz-road-tours-next-watch`: https://www.southarts.org/grants-opportunities/jazz-road-tours-old — 公式ページは2025年10月15日終了のまま。2026年追加サイクルは掲載されていないため`closed`維持。
- `cci-quick-grant-august-2026`: https://cciarts.org/quick-grant/ — 2026年8月15日11:59 PTの回がopen、最大600 USDを確認。
- `austin-elevate-fy27`: https://www.austintexas.gov/arts-culture/elevate — 7月7日〜8月18日18:59、総枠11M USD、申請主体別上限を確認。
- `austin-live-music-fund-fy27`: https://www.austintexas.gov/arts-culture/austin-live-music-fund — 7月7日〜8月18日18:59、総枠6M USD、音楽家・プロモーター5,000/20,000 USD等を確認。

### 公式本文を確認できなかった1件

- `maaa-artistic-innovations-next-cycle`: https://www.maaa.org/programs-grants/artistic-innovations/ — Web抽出とcurlの双方でCloudflare challenge / HTTP 403。2026年8月開始予定という既存記録を更新せず、`verifiedAt=2026-07-23`を保持し、`nextCheckDate=2026-08-12`に設定。

## Wave 2 Verification

- funding audit: total 75、errors 0、reviewsDue 0。
- tests: 25/25成功。
- `git diff --check`: 成功。

## Wave 3 — festival radar再確認期限超過7件

### `imaginarius-2027`

- 公式: https://www.imaginarius.pt/convocatoria-internacional/
- 結果: 2027国際公募の受付期間は2026年5月25日〜7月30日。現在は締切後。
- 反映: `status=watch`を維持、`verifiedAt=2026-08-05`、次回公募を推測せず`nextCheckDate=2027-05-15`。

### `sundance-film-2027`

- 公式FAQ: https://www.sundance.org/wp-content/uploads/2026/06/2027_Submissions_FAQ.pdf
- 結果: 国際短編のLateは8月31日、EpisodicのLateは9月11日、国際長編のLateは9月21日、各23:59 PSTという既存内容を確認。
- 反映: `status=open`と9月21日を維持。`verifiedAt=2026-08-05`、`nextCheckDate=2026-08-25`。

### `cubadupa-2027-open`

- 公式: https://www.cubadupa.co.nz/cubadupa-2027-artist-eois-now-open/
- 結果: 2027 Artist EOIは公演・特別企画・インスタレーションの3形式で、2026年8月7日締切。国外応募可否や渡航条件は非掲載。
- 反映: `status=open`を維持。`verifiedAt=2026-08-05`、締切当日の`nextCheckDate=2026-08-07`。

### `nelson-fringe-2027-upcoming`

- 公式: https://nelsonfringe.co.nz/ および https://nelsonfringe.co.nz/artists/
- 結果: トップページは「2026年8月に受付開始」と掲載し、ArtistページはEventotron申請手順を掲載。ただし明確な開始日・締切日はない。
- 反映: 推測せず`status=upcoming`を維持。`verifiedAt=2026-08-05`、`nextCheckDate=2026-08-12`。

### `toronto-buskerfest-performer-open`

- 公式: https://torontobuskerfest.com/performers/
- 結果: 2026年9月4〜7日の出演者フォームとApply Hereリンクが現存。締切日は非掲載。渡航補助は限定的。
- 反映: `status=open`を維持。`verifiedAt=2026-08-05`、`nextCheckDate=2026-08-20`。

### `waterloo-busker-carnival-performer-open`

- 公式: https://waterloobuskers.com/get-involved-waterloo-busker-carnival/
- 結果: 2026年8月27〜30日向けCircle showおよびRoving & installationの応募リンクが現存。締切日は非掲載、渡航補助は限定的。
- 反映: `status=open`を維持。`verifiedAt=2026-08-05`、`nextCheckDate=2026-08-15`。

### `ottawa-buskerfest-performer-inquiry-open`

- 公式: https://www.ottawabuskerfestival.com/get-involved/ および https://www.ottawabuskerfestival.com/performers/
- 結果: 2026年8月7〜9日の出演問い合わせ導線は現存するが、サイト上で予約されるものではない。22出演者の一覧も公開済み。
- 反映: 問い合わせ経路として`status=open`を維持し、既存の警告も保持。`verifiedAt=2026-08-05`、直前再確認の`nextCheckDate=2026-08-06`。
