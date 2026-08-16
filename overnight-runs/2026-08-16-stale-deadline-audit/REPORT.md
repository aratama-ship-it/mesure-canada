# 締切超過チェック 2026-08-16

## 発端
push前のテスト実行で `cubadupa-2027-open` が「締切を過ぎても open のまま」と検出。
同日時点(2026-08-16)で同種の問題を持つレコードが他に5件あることが判明した。

## 確認・修正完了(2件)

| ID | 公式ページの確認内容 | 対応 |
|---|---|---|
| `cubadupa-2027-open` | 「Now Closed!」と明記。結果は2026-10-23までに通知予定 | `status: open→watch`、`verifiedAt`更新、`deadlineLabel`/`fundingReview.note`を実態に合わせて書き換え |
| `cirko-w-coproduction-2028-regional` | 「The Open Call has ended」と明記。結果は2026-11-03発表予定 | 同上 |

いずれも `data/festival-radar.json` と `tests/rendered-html.test.mjs`（`verifiedAt`期待値）の両方を更新し、
過去の監査コミット(`b856245` 等)と同じ運用に揃えた。

## 未解決・要フォロー(4件)

公式ページの取得に失敗し、募集終了を裏付けられなかった。**推測で「終了」と断定する記述は書いていない。**
本人判断で「確認できないものは保留」としたため、`status`は`open`のまま据え置き。

| ID | 記録上の締切 | 公式URL | 取得結果 |
|---|---|---|---|
| `dok-leipzig-short-n-sweet-2026-open` | 2026-08-12 | https://www.dok-leipzig.de/en/submission | 取得内容が空白 |
| `padimai-oops-onchain-residency-2026-open` | 2026-08-15 | https://www.padimai.net/feed/open-call-oops-origin-of-primary-source-padimai-art-tech-studio-invites-applications-for-onchain-artist-residency | HTTP 403 |
| `plexus-remote-residency-2026-open` | 2026-08-15 | https://www.plexusprojects.org/open-call-remote-artist-residency | 取得成功だが**月次ローリング応募**（"Applications are Reviewed Monthly"）。ページは依然「NEXT DEADLINE: AUG 15, 2026」と表示中で、次回締切(おそらく9/15)が未確定。単純な「終了」扱いは不適切 |
| `confluence-of-myths-tra-vinh-2026-open` | 2026-08-09 | https://www.goethe.de/ins/vn/en/m/kul/aus/tvr.html | HTTP 403 |

## 次にやること

- 403の2件は、ブラウザ経由（Chrome拡張等）でのアクセスを試す余地がある。
- `plexus`はローリング応募という性質上、スキーマに「rolling/monthly」のような区分を足すか、
  次回締切が確認でき次第 `deadlineDate` を更新する運用が要る。
- 上記4件が解決するまで、このリポジトリの `npm test` は失敗し続ける（想定内）。
  **pushは保留。**
