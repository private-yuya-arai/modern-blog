const r=`---\r
slug: "causal-inference-chapter26"\r
title: "因果推論：相関関係と因果関係を見分ける技術"\r
date: "2026-01-22"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "因果推論", "傾向スコア", "バックドア基準"]\r
excerpt: "「薬を飲んだら治った」は本当に薬のおかげ？それとも自然治癒？データ分析の最大の落とし穴「擬似相関」を見抜き、真の因果効果を推定する現代のマジック。"\r
image: "/images/causal.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **広告効果測定**: 「広告を見た人が買った」のは、広告のおかげか、それとも元々買う気のある人が広告を見ただけか？（選択バイアス）\r
*   **政策評価**: 「職業訓練を受けた人は年収が高い」のは訓練の効果か、やる気のある人が受けたからか？\r
*   **医療統計**: 倫理的にランダム化比較試験（RCT）ができない状況で、薬の効果を推定したいとき。\r
\r
## 相関 $\\neq$ 因果\r
\r
「アイスクリームが売れる日は、水難事故が多い」 $\\rightarrow$ アイス禁止令を出しても事故は減りません。\r
共通の原因（交絡因子）、つまり「気温が高い」が両方に影響しているからです。\r
\r
\`\`\`mermaid\r
graph TD\r
    Ice["アイスクリームの売上"] --- Accident["水難事故の件数"]\r
    Ice -.-|相関あり| Accident\r
    \r
    Temp["気温<br>(交絡因子)"] -->|原因| Ice\r
    Temp -->|原因| Accident\r
    \r
    Temp -->|これが真犯人| Confounding["擬似相関"]\r
\`\`\`\r
\r
## 因果推論のアプローチ\r
\r
バイアスを取り除き、「もし〜しなかったら（反事実）」との差を推定する技法です。\r
\r
| 手法名 | アイデア | 使いどころ |\r
| :--- | :--- | :--- |\r
| **ランダム化比較試験 (RCT)** | コイン投げでグループ分け。最強。 | 倫理的・コスト的に可能なとき。 |\r
| **重回帰分析** | 交絡因子を説明変数に入れる。 | 交絡因子が全部わかっているとき。 |\r
| **傾向スコア (Propensity Score)** | 「処置を受ける確率」が似ている人同士を比べる。 | 変数が多くて重なりにくいとき。今の主流。 |\r
| **操作変数法 (IV)** | 「くじ引き」に近い要素（操作変数）を利用する。 | 未観測の交絡因子があるとき。 |\r
\r
## Pythonでの実装：傾向スコア・マッチング\r
\r
「処置群（薬あり）」と「対照群（薬なし）」の属性バランスを整えてから比較します。\r
\r
\`\`\`python\r
import pandas as pd\r
import numpy as np\r
from sklearn.linear_model import LogisticRegression\r
from sklearn.neighbors import NearestNeighbors\r
\r
# 傾向スコアの計算 (Logistic Regression)\r
# Z: 処置(0/1), X: 属性(年齢など), Y: 結果(治癒)\r
# ... データ準備 ...\r
\r
model = LogisticRegression()\r
model.fit(X, Z)\r
ps = model.predict_proba(X)[:, 1] # 傾向スコア\r
\r
# マッチング (Nearest Neighbor)\r
# 処置群の人と、スコアが近い対照群の人をペアにする\r
# ... 実装省略（CausalMLなどのライブラリを使うと楽） ...\r
\r
# マッチング後の平均差 (ATT) を計算\r
att = matched_treatment_mean - matched_control_mean\r
print(f"因果効果 (ATT): {att:.2f}")\r
\`\`\`\r
\r
## Rでの実装：Matchingパッケージ\r
\r
Rは因果推論のライブラリが充実しています。\r
\r
\`\`\`r\r
library(Matching)\r
\r
# Lalondeデータセット（職業訓練の効果）\r
data(lalonde)\r
\r
# 傾向スコアなしの単純比較 (バイアスあり)\r
simple_diff <- mean(lalonde$re78[lalonde$treat==1]) - mean(lalonde$re78[lalonde$treat==0])\r
\r
# 傾向スコア・マッチング\r
# Y: outcome, Tr: treatment, X: covariates\r
m_out <- Match(Y=lalonde$re78, Tr=lalonde$treat, X=lalonde[, c("age", "educ", "black", "hisp", "married", "nodegr", "re74", "re75")], M=1)\r
\r
summary(m_out)\r
# Estimate が因果効果\r
\`\`\`\r
\r
## まとめ\r
\r
*   データに相関があっても、すぐに因果関係だと飛びつかない（**交絡**を疑う）。\r
*   理想はRCTだが、無理なら**傾向スコア**などで「あたかも実験したかのような状態」を人工的に作り出す。\r
*   「反事実（もしあの時〜していなかったら）」を想像することが因果推論の第一歩。\r
`;export{r as default};
