const r=`---\r
slug: "applied-statistics-chapter20"\r
title: "応用統計学の森：生存時間解析と欠測データへの誘い"\r
date: "2025-12-25"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "生存時間解析", "カプランマイヤー", "欠測データ"]\r
excerpt: "医療統計やマーケティングで必須の「生存時間解析（いつイベントが起きるか）」と、避けて通れない「データが欠けている（欠測）」問題の基礎を紹介。"\r
image: "/images/data-analysis.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **医療**: 手術後、患者さんが「何年生きられるか（生存率）」を推定したいとき。\r
*   **マーケティング**: ユーザーがサービスを「解約（チャーン）するまでの期間」を分析したいとき。\r
*   **アンケート**: 「年収」の回答欄が空白のデータがたくさんあるが、捨てずに分析したいとき。\r
\r
## 生存時間解析 (Survival Analysis)\r
\r
「イベント（死亡、故障、解約など）が起きるまでの時間 $T$」を扱う特殊な統計学です。\r
\r
### 打ち切り (Censoring) 問題\r
普通の平均値が使えない最大の理由は「打ち切り」があるからです。\r
「観察期間終了まで生きていた」というデータは、「生存時間 $= 1000$日」ではなく「少なくとも1000日以上（$1000+$）」という情報です。これを正しく扱う手法が必要です。\r
\r
\`\`\`mermaid\r
graph LR\r
    Start["観察開始"] --> Event["イベント発生<br>(死亡・解約)"]\r
    Event --> Data1["完全データ<br>T=300日"]\r
    \r
    Start --> End["観察終了<br>(まだ生きてる)"]\r
    End --> Data2["打ち切りデータ<br>T > 500日"]\r
    \r
    Start --> Drop["脱落<br>(引っ越しなど)"]\r
    Drop --> Data3["打ち切りデータ<br>T > 150日"]\r
\`\`\`\r
\r
### カプラン・マイヤー推定法\r
「生存率曲線」を描くデファクトスタンダードです。階段状のグラフになります。\r
\r
## 欠測データ解析 (Missing Data)\r
\r
データの一部が欠けているとき、どうしますか？「とりあえず平均値で埋める」は危険かもしれません。\r
\r
| 欠測メカニズム | 名前 | 説明 | 対処法 |\r
| :--- | :--- | :--- | :--- |\r
| **MCAR** (完全無作為) | Missing Completely At Random | サイコロを振って消したようにランダム。 | そのまま削除しても偏らない（OK）。 |\r
| **MAR** (無作為) | Missing At Random | 他の変数（性別など）によってはランダム。「女性は体重を書かない傾向がある」など。 | **多重代入法**などで補正可能。 |\r
| **MNAR** (無作為でない) | Missing Not At Random | 「年収が高い人ほど年収を書かない」など、隠れた値そのものが欠測理由。 | **対処困難**。専門的なモデリングが必要。 |\r
\r
## Pythonでの実装：カプラン・マイヤー曲線\r
\r
\`lifelines\` ライブラリを使えば、生存曲線を一発で描けます。\r
\r
\`\`\`python\r
# pip install lifelines\r
from lifelines import KaplanMeierFitter\r
import matplotlib.pyplot as plt\r
import pandas as pd\r
\r
# サンプルデータ\r
# T: 期間, E: イベント発生(1)か打ち切り(0)か\r
data = pd.DataFrame({\r
    'T': [5, 6, 6, 2.5, 4, 4],\r
    'E': [1, 0, 0, 1, 1, 1],\r
    'group': ['A', 'A', 'A', 'B', 'B', 'B']\r
})\r
\r
kmf = KaplanMeierFitter()\r
\r
# グループAの生存曲線\r
kmf.fit(data[data['group']=='A']['T'], data[data['group']=='A']['E'], label='Group A')\r
ax = kmf.plot_survival_function()\r
\r
# グループBの生存曲線\r
kmf.fit(data[data['group']=='B']['T'], data[data['group']=='B']['E'], label='Group B')\r
kmf.plot_survival_function(ax=ax)\r
\r
plt.title("Kaplan-Meier Survival Curve")\r
plt.ylabel("Survival Probability")\r
plt.show()\r
\`\`\`\r
\r
## Rでの実装：欠測データの可視化\r
\r
\`VIM\` パッケージを使うと、どこに欠測が集中しているか（パターン）を視覚的にチェックできます。\r
\r
\`\`\`r\r
library(VIM)\r
data(sleep, package="VIM") # 哺乳類の睡眠データ\r
\r
# 欠測パターンの可視化\r
# 左側: 変数ごとの欠測率\r
# 右側: 欠測の組み合わせ（DreamとNonDが同時に欠測しやすい、など）\r
aggr(sleep, prop=FALSE, numbers=TRUE)\r
\r
# マトリックスプロット\r
# 特定の値（例えば短い寿命）のときに欠測しやすいか？などをチェック\r
matrixplot(sleep)\r
\`\`\`\r
\r
## まとめ\r
\r
*   時間のデータには**生存時間解析**。打ち切りデータを捨てずに活用できる。平均寿命より**生存曲線（中央値）**を見よ。\r
*   欠測データには**メカニズム**がある。「なぜ空白なのか？」を考えずに削除したり埋めたりすると、分析結果が歪む（バイアス）。\r
*   MARなら**多重代入法 (MICE)** で救える。\r
`;export{r as default};
