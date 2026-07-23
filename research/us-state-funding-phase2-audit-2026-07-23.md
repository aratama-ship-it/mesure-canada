# MESURE 米国州別助成フェーズ2 監査

確認日: 2026-07-23  
対象: California / Illinois / Texas（Austin・Houstonを含む）

## 結論

- 公式情報から12制度を追加できた。データベースは63件から75件になった。
- 州単位だけでは誤判定するため、IllinoisはChicago Metro／それ以外、TexasはAustin MSA／City of Houston／それ以外に分けた。
- Houston Arts Allianceの2027年次要項は、非米国市民の個人申請を明示的に認める。ただし、米国内の当座預金口座、有効なSSN、助成金を直接受領できることの3条件が必要である。
- Illinois Arts Councilの個人申請は、公式のProof of Eligibilityにより米国市民または永住者、かつイリノイ州に12か月以上法的に居住していることが必要である。
- CaliforniaとAustinの公開ページが在留資格区分を列挙していない制度は、利用可能と断定せず「個別確認」にした。

## 追加レコードと一次情報

| 地域 | 制度 | 2026-07-23時点 | 主要な根拠 |
|---|---|---|---|
| California | CCI Quick Grant | 8月15日締切、最大600 USD | [公式ページ](https://cciarts.org/quick-grant/) |
| California | CAC Individual Artists Fellowship | 2026地域募集終了、次回監視 | [California Arts Council](https://arts.ca.gov/grant_program/individual-artists-fellowship/) |
| Illinois（Chicago外） | Creative Projects Grant | 地域予算終了まで随時、最大12,000 USD | [制度ページ](https://arts.illinois.gov/granting-opportunities/grants-programs/creative-projects-grant.html) / [資格証明](https://arts.illinois.gov/granting-opportunities/funding-programs/proof-of-eligibility.html) |
| Illinois | Creative Accelerator Fund | 9月開始予定、10,000 USD | [制度ページ](https://arts.illinois.gov/granting-opportunities/grants-programs/creative-accelerator-fund.html) |
| Austin | Elevate FY27 | 8月18日18:59締切 | [City of Austin](https://www.austintexas.gov/arts-culture/elevate) |
| Austin | Nexus Fall 2026 | 9月8日開始、5,000／10,000 USD | [City of Austin](https://www.austintexas.gov/arts-culture/nexus) |
| Austin | Austin Live Music Fund FY27 | 8月18日18:59締切 | [City of Austin](https://www.austintexas.gov/arts-culture/austin-live-music-fund) |
| Houston | Support for Artists and Creative Individuals 2027 | 7月24日23:59 CDT、最大15,000 USD | [募集一覧](https://houstonartsalliance.com/grant-opportunities-and-workshops/) / [年次要項PDF](https://files.haatx.com/grants/2027_Annual_Grants_Guidelines.pdf) |
| Houston | Festival Grant 2027 | 7月24日23:59 CDT、最大10,000 USD | [募集一覧](https://houstonartsalliance.com/grant-opportunities-and-workshops/) / [年次要項PDF](https://files.haatx.com/grants/2027_Annual_Grants_Guidelines.pdf) |
| Houston | Let Creativity Happen! Round 3 | 8月28日開始、9月26日締切、最大2,500 USD | [募集一覧](https://houstonartsalliance.com/grant-opportunities-and-workshops/) |
| Houston | City’s Initiative Round 3 | 8月28日開始、9月26日締切、最大10,000 USD | [募集一覧](https://houstonartsalliance.com/grant-opportunities-and-workshops/) |
| Texas | Texas Touring Roster | 2026–2028募集終了、次回監視 | [Texas Commission on the Arts](https://www.arts.texas.gov/?Itemid=102&id=83&option=com_content&paged=2&view=article) |

## 判定上の境界

1. `verificationStatuses` は「対象」と同義ではない。公開要項で国籍・在留資格が決着しないため、申請先への確認が必要という状態である。
2. Chicago Metroを選んだ場合、現在予算終了と公表されたCreative Projects Grantを表示しない。州全域のCreative Accelerator Fundは表示する。
3. Houstonの非米国市民ルートは、条件を満たす回答なら「条件付き」、不明なら「要確認」、満たさないなら「対象外」とする。
4. Austinは都市圏本部、Austinでの制作実績、市内またはETJでの公開活動などを要する。州内居住だけでは表示しない。
5. CAC Fellowshipは8地域の運営団体で細則が異なるため、次回の地域別要項が出るまで監視扱いとする。

## 次回確認日

- 2026-07-24: Houston SACI / Festival締切状態
- 2026-08-01: California Quick Grant、Austin FY27制度
- 2026-08-15: Illinois Creative Projectsの地域残額
- 2026-08-28: Houston Round 3要項
- 2026-09-01〜08: Illinois Accelerator、Austin Nexus
- 2026-12-01以降: Texas Touring Roster次回募集
