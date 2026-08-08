# Source Checks

確認日: 2026-08-05 JST

## Wave 1

### `fringemtl-2027-watch`

- 公式: https://www.montrealfringe.ca/2027-inscriptions-applications
- 結果: 2027受付は2026年8月13日18:00 EDT開始。カナダ・国際区分は各先着5団体。抽選応募は11月20日18:00締切、11月22日抽選。先着採択は24時間以内に参加料全額支払い。出演者へ興行収入100%を還元。
- 不明: 参加料金額、渡航、宿泊、制作支援。
- 反映: `status=upcoming`、`deadlineDate=2026-11-20`、`nextCheckDate=2026-08-13`、decisionGuide追加。

### `vancouver-fringe-2027-upcoming`

- 公式: https://www.vancouverfringe.com/artist-zone/
- 結果: 2027 Mainstage抽選は2026年秋開始予定。9月7〜19日に参加可能であること。IBPOC枠と一般枠の二段階抽選。6公演、標準劇場設備、1枚5 CADの販売手数料を除く興行収入100%。応募料と参加料は必須だが2027年額は未掲載。
- 不明: 2027年の料金、渡航、宿泊、就労資格の具体条件。
- 反映: `status=upcoming`を維持、decisionGuide追加。

### `tohu-research-creation-residencies-watch`

- 公式: https://tohu.ca/fr/attraits-et-services/artistes-et-professionnels/residences
- 結果: サーカスの個人、コレクティブ、非営利団体に研究・創作の空間、時間、施設、サービスを提供。金銭助成なし。ページは引き続き2025年募集を掲載。
- 不明: 2026–27年の受付可否、対象期間、申請締切。
- 反映: `status=watch`を維持、decisionGuide追加。

### `festival-chapo-next-watch`

- 公式: https://festivalchapo.com/ および https://festivalchapo.com/deposer-une-candidature/
- 結果: 公式サイトは国際大道芸フェスティバルとして応募リンクを表示するが、リンク先から現行フォーム・条件を取得できない。
- 不明: 受付可否、締切、応募料、出演料、渡航、宿泊、食事、制作・物流支援。
- 反映: `status=watch`を維持、`nextCheckDate=2026-08-12`、推測を避けたdecisionGuide追加。

## Wave 1 Verification

- JSON配列・4件のdecisionGuide構造確認: 成功。
- tests: 固定ID一覧更新後25/25成功。
- `git diff --check`: 成功。

## Wave 2

### `victoria-fringe-2027-watch`

- 公式PDF: https://intrepidtheatre.com/wp-content/uploads/2025/09/2026-Victoria-Fringe-Festival-Lottery-Application-PREVIEW-ONLY.pdf
- 公式応募一覧: https://intrepidtheatre.com/artists/applications/
- 結果: 2026年はNational区分がBC以外のカナダ恒久居住者向け。応募30 CAD、採択後570 CADまたは公平性対象470 CAD。公式一覧では2026募集はclosed。旧募集URLは現在Incoming Festivalへ転送される。
- 不明: 2027年の受付日、料金、会場支援、公演数、渡航・宿泊。
- 反映: `sourceUrl`を現存公式PDFへ更新、`status=watch`を維持、decisionGuide追加。

### `edmonton-fringe-2027-upcoming`

- 公式: https://www.fringetheatre.ca/festival/artists/indoor/
- 結果: Local/National/InternationalのIndoor抽選。カナダ居住者はNational。例年10月受付・11月抽選。会場・舞台・照明・音響・発券・技術者2名を含む約15,000 CADの現物支援。ボランティア宅宿泊は保証なし。
- 不明: 2027年の正確な日程・料金、渡航支援。
- 反映: `status=upcoming`を維持、decisionGuide追加。

### `ottawa-fringe-2027-watch`

- 公式: https://ottawafringe.com/lottery/
- 結果: 2026年は地域50%、カナダ国内30%、国外20%、フランス語作品の一部枠。応募25 CAD、採択後660 CAD、興行収入100%を出演者へ還元。
- 不明: 2027年の日程・料金、渡航・宿泊・制作支援。
- 反映: `status=watch`を維持、decisionGuide追加。

### `caff-touring-lottery-watch`

- 公式: https://fringefestivals.com/for-artists/2026-touring-lottery/
- 結果: 過去Fringe参加、加盟フェス3件以上、1応募、恒久住所による区分、2026年処理料40 CADを確認。CAFFが空き枠に応じ複数都市ルートを調整するが、各フェスの料金・日程・収入条件は個別。
- 不明: 次回日程・料金、各開催地の渡航・宿泊支援。
- 反映: `status=watch`を維持、decisionGuide追加。

## Wave 2 Verification

- JSON配列・4件のdecisionGuide構造確認: 成功。
- tests: 25/25成功。
- `git diff --check`: 成功。

## Wave 3

### `toronto-fringe-2027`

- 公式: https://fringetoronto.com/get-involved/artists/fringe
- 結果: 地元・国内・国外の誰でも応募可。Main/Satelliteは抽選、Unconventional Venueは先着。Mainは会場・技術・フロント・発券・共同広報を提供し、出演者へ興行収入100%を還元。作品制作、追加制作費、渡航・宿泊は出演者負担。2027募集は2026年晩秋開始予定。
- 不明: 2027年の正確な日程・料金。
- 反映: `status=upcoming`を維持、decisionGuide追加。

### `contact-ontarois-2027-watch`

- 公式: https://scenesfrancophones.ca/inscriptions/contact-ontarois
- 結果: 舞台芸術で観客とフランス語交流、同一作品を過去2年にVitrine等で提示していないこと。申請75 CAD＋税、採択チーム参加登録375 CAD＋税、提携ホテル189 CAD＋税、20分ショーケース、デジタルカタログ掲載。
- 不明: ショーケース出演料、渡航・食事支援。
- 反映: `status=watch`を維持、decisionGuide追加。

### `halifax-busker-festival-2027-watch`

- 公式: https://www.buskers.ca/be-a-performer.html
- 結果: 2027募集は2026年後半開始予定。動画、演目キーワード、短い説明、写真のあるサイト／SNSが必要で、採択者のみ連絡。
- 不明: 応募料、出演料、渡航、宿泊、食事、保険、貨物、公演回数。
- 反映: `status=watch`を維持、推測を避けたdecisionGuide追加。

### `edmonton-street-performers-2027-watch`

- 公式: https://edmontonstreetfest.com/、https://edmontonstreetfest.com/about/history/our-history/
- 結果: 伝統的な大道芸、回遊、ダンス、マイム、音楽、人形劇等の国際フェス。2026出演募集は終了。無料公開・投げ銭方式。
- 不明: 2027受付、応募料、出演料、渡航、宿泊、食事、保険、貨物、公演回数。
- 反映: `status=watch`を維持、decisionGuide追加。

## Wave 3 Verification

- JSON配列・4件のdecisionGuide構造確認: 成功。
- tests: 25/25成功。
- `git diff --check`: 成功。
