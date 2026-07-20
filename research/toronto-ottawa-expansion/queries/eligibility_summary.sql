-- Compiled from official Canada Council, Ontario Arts Council,
-- Toronto Arts Council, Toronto Arts Foundation, and City of Ottawa criteria.
-- Full official URLs and interpretation notes are included in the report body.
-- Verified: 2026-07-20
SELECT 'Canada Council 一般プロフィール' AS program,
       '市民・PR・Protected／居住条件は制度別' AS standard_eligibility,
       '不可（確定）' AS temporary_path_and_state
UNION ALL
SELECT 'OAC Project Programs',
       '市民・PR・PR申請中／Ontario 12か月',
       '原則不可（確定）'
UNION ALL
SELECT 'TAC 通常助成',
       '市民・PR・PR申請中・Protected／Toronto 1年・年8か月',
       '原則不可（確定）'
UNION ALL
SELECT 'TAC Newcomer Mentorship',
       '国籍区分の列挙なし／Toronto市内・2019年以降に到着',
       '就労許可＋SINで可（確定）'
UNION ALL
SELECT 'ArtWorksTO',
       '市民・PR・PR申請中・Protected／GTA在住ほか',
       '就労許可あり：条件付き'
UNION ALL
SELECT 'オタワ市 Cultural Funding Policy',
       '国籍・在留区分の列挙なし／Ottawa市内',
       '明記なし（要確認）';
