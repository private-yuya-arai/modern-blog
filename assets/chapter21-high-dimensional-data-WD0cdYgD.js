const r=`---\r
slug: "high-dimensional-data-chapter21"\r
title: "高次元データの呪いと祝福：変数が多すぎるときどう戦うか？"\r
date: "2025-12-30"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "高次元データ", "多重共線性", "次元の呪い"]\r
excerpt: "変数が増えれば増えるほど精度が上がる…わけではない。「次元の呪い」の正体と、それを回避するための戦略をマップで整理。"\r
image: "/images/high-dim.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **ゲノム解析**: 数万個の遺伝子データから、病気に関係ある数個を見つけたいとき（$p \\gg n$ 問題）。\r
*   **画像認識**: 数百万ピクセルの画像データから、意味のある特徴を抽出したいとき。\r
*   **推薦システム**: 何百万もの商品とユーザーの組み合わせから、好みを予測したいとき。\r
\r
## 次元の呪い (Curse of Dimensionality)\r
\r
変数の数（次元）が増えると、空間がスカスカになり、データの「距離」が無意味になったり、計算量が爆発したりする現象です。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start["変数を増やす"] --> Merit["情報量UP<br>表現力UP"]\r
    Start --> Demerit["スカスカになる<br>距離が遠くなる"]\r
    \r
    Demerit --> Result1["過学習しやすい<br>(Overfitting)"]\r
    Demerit --> Result2["計算が終わらない<br>(Calculation)"]\r
    Demerit --> Result3["可視化できない<br>(Visualization)"]\r
    \r
    Result1 --> Curse\r
    Result2 --> Curse\r
    Result3 --> Curse["次元の呪い"]\r
\`\`\`\r
\r
### 小数点以下の魔法：スパース性\r
高次元空間では、ほとんどの場所が「空っぽ」です。これを逆手に取って、「重要な変数はごく一部だけだ（スパース性）」と仮定することで、呪いを解くことができます（Lasso回帰など）。\r
\r
## 戦略マップ：多すぎる変数をどうする？\r
\r
| アプローチ | 手法名 | イメージ | メリット | デメリット |\r
| :--- | :--- | :--- | :--- | :--- |\r
| **特徴量選択** | ステップワイズ法<br>Lasso回帰 | ゴミを捨てる | 解釈しやすい（「これとこれが大事」と言える）。 | 捨てた変数に含まれる情報を失う。 |\r
| **特徴量抽出** | 主成分分析 (PCA)<br>オートエンコーダ | 混ぜて圧縮する | 情報をなるべく残せる。可視化できる。 | 混ぜた変数の意味がわからなくなる（解釈性ダウン）。 |\r
| **正則化** | リッジ回帰 (L2)<br>Elastic Net | 暴れるのを抑える | 係数を小さくして過学習を防ぐ。安定する。 | 変数は減らない（係数が0になりにくい）。 |\r
\r
## Pythonでの実装：正則化回帰の比較\r
\r
変数が多すぎる（100個）のにデータが少ない（20個）状況で、普通に回帰すると過学習してしまいます。LassoとRidgeでどう変わるか見ます。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from sklearn.linear_model import LinearRegression, Lasso, Ridge\r
from sklearn.pipeline import make_pipeline\r
from sklearn.preprocessing import StandardScaler\r
\r
# データ生成 (p=100, n=20)\r
np.random.seed(42)\r
X = np.random.randn(20, 100)\r
# 本当に効いている変数は最初の3つだけ\r
true_coef = np.zeros(100)\r
true_coef[:3] = [10, -5, 2]\r
y = X @ true_coef + np.random.randn(20)\r
\r
# 1. 普通の線形回帰 (あてずっぽうにフィットしてしまう)\r
lr = LinearRegression().fit(X, y)\r
\r
# 2. Lasso (L1正則化: 不要な変数を0にする)\r
lasso = Lasso(alpha=0.1).fit(X, y)\r
\r
# 3. Ridge (L2正則化: 係数を小さく抑える)\r
ridge = Ridge(alpha=0.1).fit(X, y)\r
\r
# 係数のプロット\r
plt.figure(figsize=(10, 5))\r
plt.plot(true_coef, 'k-', label='True Coef', linewidth=2)\r
plt.plot(lr.coef_, 'o', label='Linear (Overfit)', alpha=0.3)\r
plt.plot(lasso.coef_, 'x', label='Lasso (Sparse)', markeredgewidth=2)\r
plt.plot(ridge.coef_, '^', label='Ridge (Shrink)', alpha=0.5)\r
plt.legend()\r
plt.title("Comparison of Coefficients in High-Dimensional Data")\r
plt.show()\r
\`\`\`\r
\r
グラフを見ると、Lasso（×印）だけが、本当に効果のある最初の3つの変数付近以外を「ゼロ」にしています。これが**変数選択**の効果です。\r
\r
## まとめ\r
\r
*   次元が増えると、直感に反する現象（呪い）が起きる。安易に変数を増やさない。\r
*   **特徴量選択（Lasso）** か **特徴量抽出（PCA）** で次元を減らすのが基本戦略。\r
*   $p \\gg n$ （変数がデータ数より多い）状況では、普通の回帰分析は不能。正則化が必須。\r
`;export{r as default};
