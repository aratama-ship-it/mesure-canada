# MESURE リリース前ローカル監査

作成時刻: 2026-08-03T01:02:29+09:00

## Objective

MESURE Canada + United States betaの現行作業ツリーを変更せず、リリース判断に必要なGit状態、データ監査、型、lint、テスト、ビルド、生成HTML、公開URLの状態を確認する。

## Scope

- 対象: `web-projects/monosashi/quebec-opportunity-match/`
- 既存コードとデータは読み取り専用
- 書き込みはビルドが通常生成する無視対象と、この夜間台帳内の報告だけ

## Definition of Done

- 開始時のHEADと既存dirty状態を保存している。
- 既存のデータ監査、typecheck、lint、test、Pages buildの成否を個別に記録している。
- 生成HTMLの主要ページ、リンク、期限表示に関する既存テスト結果を記録している。
- 公開可否を自動決定せず、ブロッカーと本人判断を列挙している。

## Allowed Actions

- Git、コード、データ、既存台帳の読み取り
- 既存package scriptsによるローカル監査、型検査、lint、test、build
- 既存公開URLへの読み取り専用HTTP確認
- この夜間台帳内へのログと報告の作成

## Prohibited Actions

- `data/*.json`、コード、テストの修正
- commit、push、deploy、publish、外部送信
- 期限・資格・費用・支援内容の推測による補完
- 既存dirty変更の巻き戻し、stash、stage
- 依存の追加・更新
- サブエージェントまたはSolの使用

## Stop Conditions

- HEADまたは保護対象の既存dirtyファイルが監査中に変化した場合、以降の書き込みを止める。
- テストが外部状態を変更する場合は実行しない。
- ネットワーク確認が認証やアカウント操作を要求する場合は停止する。

## Team

- Coordinator / Writer / Verifier: Codex単独で順次実行
- Subagents: 使用しない

## Verification

1. 開始・終了時のHEAD、status、保護ファイルSHA-256を比較する。
2. `audit:funding-data`、`typecheck`、`lint`、`test`、`build:pages`を順に実行する。
3. 各コマンドの終了コードと要約をこの台帳へ残す。
4. 台帳validatorを最終モードで通す。

