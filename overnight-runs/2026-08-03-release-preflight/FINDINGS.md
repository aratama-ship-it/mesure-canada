# MESURE リリース前監査結果

監査日: 2026-08-03

## 判定

ローカルコードは型、lint、通常ビルド、Pagesビルドを通る。助成公式リンク87件にも死活上の404・410はない。

しかし、期限切れを`open`のまま保持する公募があり、テスト25件中1件が失敗する。更新期限を過ぎた助成11件、レーダー10件もある。現在のデータを確認・更新するまで再リリース不可。

## 開始時状態

- Git HEAD: `bbd4609061c329db40d2460d59f6d1554c007822`
- 既存変更: `.gitignore`、`data/festival-radar.json`、`data/funding.json`、`tests/rendered-html.test.mjs`
- 既存未追跡: `overnight-runs/`
- 監査では既存変更を編集、stage、stash、rollbackしていない。

## 検証結果

| 検証 | 結果 | 要点 |
|---|---|---|
| `audit:funding-data --date 2026-08-03` | 失敗 | 構造エラー0、source review期限超過11件 |
| `typecheck` | 成功 | TypeScriptエラー0 |
| `lint` | 成功 | ESLintエラー0 |
| `npm test` | 失敗 | 25件中24成功、1失敗 |
| vinext通常ビルド | 成功 | `/`と`/radar`を生成。500kB超chunk警告あり |
| `build:pages` | 成功 | サンドボックス外で再実行し、4静的ページを生成 |
| 助成公式リンク | 成功 | 87 URL: healthy 82、403 restricted 5、dead 0、unreachable 0 |
| 公開URL | 応答 | `/`と`/radar/`はHTTP 200 |

最初のPages buildはサンドボックスのローカルポート制限で失敗した。同じコマンドを通常環境で再実行すると成功したため、これはアプリのビルドエラーではない。

## リリース阻害要因

### 1. 期限切れを募集中として保持

`festival-radar.json`で、2026-08-03時点に期限を過ぎても`open`のものが4件ある。

- `cairo-film-2026` — 期限2026-08-01
- `tehran-mobarak-puppet-festival-2026-open` — 期限2026-08-01
- `festival-animated-objects-incubator-2026-28-open` — 期限2026-08-02
- `yaddo-performance-residency-nov-2026-jun-2027-open` — 期限2026-08-01

`opportunities.json`では次の1件が該当する。

- `wjf-23-seattle` — 期限2026-07-31、状態`open`

既存テストは`cairo-film-2026 is marked open after its deadline`で最初に停止するため、他の4件も別途確認が必要。

### 2. 公式情報の再確認期限超過

- 助成データ: 11件
- festival radar: 10件

期限を過ぎたことだけでは内容が誤りとは断定しない。ただし、更新確認なしで現行情報として再公開しない。

### 3. 公開版はローカル版より古い

- 公開`/radar/`の`radar-row`はHTML内で352出現し、RSC二重表現を考慮すると176件。
- ローカルPages buildは442出現し、同様に221件。
- 公開トップにも「176 pistes」と表示される。

したがって公開サイトは現在も旧176件版で、ローカル221件版は未公開。

### 4. 公開版にも過日期限が募集中表示

2026-08-03の公開トップで、2026年7月24日〜31日の複数案件が`Ouvert`として表示されている。ベータ注意書きはあるが、fail-closed運用としてはリリース前に状態更新が必要。

## 更新対象

### 助成11件

- `afa-theatre-individual-project-2026`
- `afa-dance-individual-project-2026`
- `mac-travel-professional-development-2026`
- `artsnb-artist-in-residence-2026`
- `nefa-nest-fy27`
- `arts-midwest-gig-fund-next-watch`
- `maaa-artistic-innovations-next-cycle`
- `jazz-road-tours-next-watch`
- `cci-quick-grant-august-2026`
- `austin-elevate-fy27`
- `austin-live-music-fund-fy27`

### レーダー再確認10件

- `imaginarius-2027`
- `cairo-film-2026`
- `cubadupa-2027-open`
- `nelson-fringe-2027-upcoming`
- `toronto-buskerfest-performer-open`
- `waterloo-busker-carnival-performer-open`
- `ottawa-buskerfest-performer-inquiry-open`
- `tehran-mobarak-puppet-festival-2026-open`
- `festival-animated-objects-incubator-2026-28-open`
- `yaddo-performance-residency-nov-2026-jun-2027-open`

## 次の最小手順

1. 上記21レコードを公式ページで再確認する。
2. 締切済みの5件は、公式根拠に基づき`watch`、`closed`相当、次回監視へ移す。推測で次回日程を作らない。
3. `npm run audit:funding-data -- --date 2026-08-03`を成功させる。
4. `npm test`を25件すべて成功させる。
5. `typecheck`、`lint`、`build:pages`を再実行する。
6. 221件版の画面をモバイル幅で確認し、本人がリリースを承認してからdeployする。

