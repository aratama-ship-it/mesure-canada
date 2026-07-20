-- Toronto Arts Council 2025 Annual Report, applications and awards by funding stream.
-- Official source: https://www.toronto.ca/legdocs/mmis/2026/ec/bgrd/backgroundfile-287210.pdf
-- Verified: 2026-07-20
SELECT 'Operating' AS funding_stream, '運営' AS funding_stream_ja, 236 AS applications, 231 AS awards, 0.9788 AS derived_award_rate
UNION ALL
SELECT 'Project', 'プロジェクト', 1526, 445, 0.2916
UNION ALL
SELECT 'Individual artist', '個人', 1282, 271, 0.2114
UNION ALL
SELECT 'Partnerships', '連携', 7, 7, 1.0000;
