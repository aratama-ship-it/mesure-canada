# Toronto / Ottawa expansion research

MESURE Québecの判定設計をTorontoとOttawaへ派生させるための、日本語調査レポート一式です。公式ページを正本とし、2026年7月20日に確認した内容を収録しています。

## Files

- `build-artifact.mjs` — レポート本文、データ、出典メタデータの編集元
- `artifact.json` — 検証・描画用のcanonical artifact
- `queries/toronto_2025_applications.sql` — グラフの再現可能な根拠データ
- `queries/eligibility_summary.sql` — 在留資格・居住条件比較の再現可能な根拠データ
- `report.html` — portable readerで生成した確認用レポート

## Update

1. 各制度の公式ページを再確認し、`build-artifact.mjs`の本文・確認日・データを更新する。
2. グラフの公表値を変更した場合は、SQLとsnapshotの両方を同時に更新する。
3. 次を実行する。

```sh
node build-artifact.mjs
node /Users/arata/.codex/plugins/cache/openai-curated-remote/data-analytics/0.2.8-13ceeea1f599/skills/build-report/scripts/deliver_portable_artifact.mjs --input artifact.json --output report.html
```

締切・受付状態は月1回に加え、締切45日前・14日前・3日前の再確認を推奨します。アグリゲーターは発見用途に限定し、適格性と締切の確定には使いません。
