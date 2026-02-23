const n=`---\r
slug: "estimation-chapter4"\r
title: "点推定と区間推定：ズバリ当てるか、幅で捉えるか"\r
date: "2025-10-14"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "点推定", "区間推定", "最尤法"]\r
excerpt: "「平均値は50点です」より「45点〜55点の間です」と言われた方が信頼できる？点推定と区間推定の違い、そして最強の推定法である「最尤推定」を解説します。"\r
image: "/images/estimation.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **選挙速報**: 「A候補の得票率は40% ± 3% と推定されます」というあの一言の意味を知りたいとき。\r
*   **ビジネスの意思決定**: 「クリック率は 5%」という一点張りではなく、「最悪でも 4.2% はある」というリスク評価がしたいとき。\r
*   **機械学習**: モデルのパラメータ学習（最尤推定）の理論的背景として。\r
\r
## 推定の2つのアプローチ\r
\r
未知のパラメータ（母平均など）を推測する方法には、2つのスタイルがあります。\r
\r
\`\`\`mermaid\r
graph TD\r
    Unknown(("未知の真の値"))\r
    \r
    subgraph 点推定\r
    Unknown -->|ピンポイント| Point["ズバリ 50.2 です"]\r
    Point --> Risks["外れる確率が高い<br>情報の損失"]\r
    end\r
    \r
    subgraph 区間推定\r
    Unknown -->|幅を持たせる| Interval["48.1 〜 52.3 の間です"]\r
    Interval --> Merits["誤差の大きさがわかる<br>信頼度を提示できる"]\r
    end\r
\`\`\`\r
\r
## 1. 点推定 (Point Estimation)\r
\r
「値はズバリこれだ！」と一点を指定する方法です。\r
\r
*   **不偏性**: 平均的に見れば的を射ているか？（偏りがないか）\r
*   **一致性**: データが増えれば真の値に近づくか？（大数の法則）\r
\r
### 最尤法（さいゆうほう）\r
点推定の王様です。「**いま手元にあるデータが得られる確率が最大になるようなパラメータ**」を答えとします。\r
\r
**イメージ**:\r
「池から魚を10匹釣ったら全部コイだった」\r
$\\rightarrow$ 「この池にはフナしかいない」「半々でいる」などの仮説よりも、「この池はコイだらけ（コイ率100%）」と考えるのが一番自然（尤もらしい）。\r
\r
## 2. 区間推定 (Interval Estimation)\r
\r
「95%の確率で、この範囲内に真の値があるような計算方法」です。\r
※ 正確には「この方法で100回区間を作れば、95回は真の値を含む」という意味（頻度論的解釈）。\r
\r
| 推定する値 | 使う分布 | 条件 | 手法名 |\r
| :--- | :--- | :--- | :--- |\r
| **母平均** $\\mu$ | **正規分布** ($Z$) | 母分散 $\\sigma^2$ が既知 | $Z$推定 |\r
| **母平均** $\\mu$ | **t分布** ($t$) | 母分散 $\\sigma^2$ が未知（普通はこれ） | t推定 |\r
| **母比率** $p$ | **正規分布** ($Z$) | サンプル数が多いとき | 近似法 |\r
| **母分散** $\\sigma^2$ | **カイ二乗分布** ($\\chi^2$) | データが正規分布に従うとき | $\\chi^2$推定 |\r
\r
### フローチャート：母平均の区間推定手順\r
\r
\`\`\`mermaid\r
graph TD\r
    Start["母平均を知りたい"] --> CheckVar{"母分散はわかってる？"}\r
    CheckVar -- Yes --> UseZ["標準正規分布を使う<br>(Z推定)"]\r
    CheckVar -- No --> UseT["t分布を使う<br>(t推定)"]\r
    \r
    UseT --> Note["サンプル数が多いと<br>t分布は正規分布に近づく"]\r
\`\`\`\r
\r
## Pythonでの実装：区間推定\r
\r
有名な \`tips\` データセットを使って、「チップの平均額」の95%信頼区間を求めてみます。母分散は未知なので、**t分布**を使います。\r
\r
\`\`\`python\r
import pandas as pd\r
import numpy as np\r
from scipy import stats\r
import seaborn as sns\r
\r
# データのロード\r
tips = sns.load_dataset('tips')['tip']\r
\r
# 統計量の計算\r
n = len(tips)           # サンプルサイズ\r
m = np.mean(tips)       # 標本平均\r
s = np.std(tips, ddof=1) # 不偏標準偏差 (ddof=1)\r
dof = n - 1             # 自由度\r
\r
# 95%信頼区間の計算 (alpha=0.05)\r
confidence = 0.95\r
alpha = 1 - confidence\r
ci = stats.t.interval(alpha=confidence, df=dof, loc=m, scale=s/np.sqrt(n))\r
\r
print(f"平均チップ額: \${m:.2f}")\r
print(f"95%信頼区間: \${ci[0]:.2f} 〜 \${ci[1]:.2f}")\r
\`\`\`\r
\r
## Rでの実装：最尤推定\r
\r
Rの \`MASS\` パッケージを使って、正規分布のパラメータ（平均と分散）を最尤推定してみます。\r
\r
\`\`\`r\r
library(MASS)\r
\r
# データ生成\r
set.seed(123)\r
data <- rnorm(100, mean=10, sd=5)\r
\r
# fitdistr関数で最尤推定\r
fit <- fitdistr(data, densfun="normal")\r
\r
print(fit)\r
# meanとsdの推定値と、その標準誤差(カッコ内)が表示されます\r
\`\`\`\r
\r
## まとめ\r
\r
*   **点推定**は使いやすいが、誤差がわからない。\r
*   **区間推定**は「幅（誤差）」を評価できるので、より科学的で誠実。\r
*   現実の問題では母分散はわからないので、**t分布**を使った区間推定が最も一般的。\r
`;export{n as default};
