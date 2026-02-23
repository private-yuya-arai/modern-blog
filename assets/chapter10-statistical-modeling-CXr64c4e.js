const r=`---\r
slug: "statistical-modeling-chapter10"\r
title: "統計的モデリングの入り口：良いモデルとは何か？"\r
date: "2025-11-11"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "モデリング", "AIC", "BIC"]\r
excerpt: "現実は複雑すぎてそのままでは扱えない。だから「モデル」という簡略地図を作る。モデルの良し悪しを決めるAIC/BICなどの情報量規準をマスターしよう。"\r
image: "/images/modeling.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **モデル選択**: 「複雑なモデル」と「シンプルなモデル」、どっちを採用すべきか悩んだとき。\r
*   **過学習の防止**: データに合わせすぎて、未知のデータに弱くなってしまう現象を防ぎたいとき。\r
*   **科学的説明**: 「この現象は、この数式で説明できる」と主張したいとき。\r
\r
## モデリングとは「地図作り」\r
\r
現実は無限に複雑ですが、すべてを記述することはできません。\r
必要な要素だけを抜き出して、扱いやすくしたものが**モデル**です。\r
\r
> 「すべてのモデルは間違っているが、いくつかは役に立つ」 (George Box)\r
\r
\`\`\`mermaid\r
graph TD\r
    Reality["複雑な現実世界<br>(ノイズだらけ)"] -->|単純化| Model["統計モデル<br>y = f(x) + ε"]\r
    Model -->|予測・説明| Decision["意思決定"]\r
    \r
    Model --> Check{"良いモデル？"}\r
    Check -->|複雑すぎる| Overfit["過学習<br>(たまたまの誤差まで覚える)"]\r
    Check -->|単純すぎる| Underfit["学習不足<br>(トレンドを捉えきれない)"]\r
    Check -->|ほどよい| Good["汎化性能が高い<br>(未知のデータに強い)"]\r
\`\`\`\r
\r
## モデル選択の基準 (AIC / BIC)\r
\r
良いモデルとは、**「データへの当てはまりが良く」かつ「シンプルである」**ものです。\r
これを数値化したのが**情報量規準**です。\r
\r
| 指標 | 名前 | 式（イメージ） | 特徴 |\r
| :--- | :--- | :--- | :--- |\r
| **AIC** | 赤池情報量規準 | $-2 \\ln(L) + 2k$ | **予測の良さ**を重視。予測モデルならこれ。 |\r
| **BIC** | ベイズ情報量規準 | $-2 \\ln(L) + k \\ln(n)$ | **真のモデル**を見つけることを重視。パラメータ数 $k$ へのペナルティが厳しい。 |\r
\r
*   $L$: 尤度（当てはまりの良さ）\r
*   $k$: パラメータ数（モデルの複雑さ）\r
*   $n$: データ数\r
\r
**小さいほど良いモデル**です。「当てはまりの悪さ（マイナスの尤度）」と「複雑さのペナルティ」の合計だからです。\r
\r
## Pythonでの実装：AICによるモデル選択\r
\r
多項式回帰（1次、2次、3次...）で、どの次数がベストかをAICで選んでみます。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from sklearn.preprocessing import PolynomialFeatures\r
from sklearn.linear_model import LinearRegression\r
from sklearn.metrics import mean_squared_error\r
\r
# 真の関数（2次関数） + ノイズ\r
np.random.seed(42)\r
X = np.random.rand(20, 1) * 10\r
y = 3 * X**2 + 2 * X + 5 + np.random.randn(20, 1) * 10\r
\r
# AICを計算する関数 (簡易版: 線形回帰の場合)\r
def calculate_aic(n, mse, num_params):\r
    likelihood = -n/2 * (1 + np.log(2*np.pi)) - n/2 * np.log(mse)\r
    return -2 * likelihood + 2 * num_params\r
\r
degrees = [1, 2, 8] # 1次(直線), 2次(正解), 8次(過学習)\r
plt.figure(figsize=(12, 4))\r
\r
for i, deg in enumerate(degrees):\r
    poly = PolynomialFeatures(degree=deg)\r
    X_poly = poly.fit_transform(X)\r
    \r
    model = LinearRegression()\r
    model.fit(X_poly, y)\r
    y_pred = model.predict(X_poly)\r
    \r
    mse = mean_squared_error(y, y_pred)\r
    aic = calculate_aic(len(y), mse, deg+1)\r
    \r
    ax = plt.subplot(1, 3, i+1)\r
    plt.scatter(X, y, color='blue')\r
    \r
    # プロット用に滑らかな線を作る\r
    X_plot = np.linspace(0, 10, 100).reshape(-1, 1)\r
    y_plot = model.predict(poly.transform(X_plot))\r
    plt.plot(X_plot, y_plot, color='red')\r
    \r
    plt.title(f"Degree {deg}\\nAIC: {aic:.1f}")\r
\r
plt.show()\r
\`\`\`\r
\r
結果を見ると：\r
*   **Degree 1 (直線)**: 当てはまりが悪く、AICが高い（学習不足）。\r
*   **Degree 2 (2次)**: 当てはまりが良く、AICが**最も低い**（ベストモデル）。\r
*   **Degree 8 (複雑)**: データ点全てを通ろうとぐにゃぐにゃしており、AICは逆に高くなる（過学習）。\r
\r
## Rでの実装：step関数による変数選択\r
\r
Rの \`step\` 関数を使うと、AICが最小になるように変数を自動で増減させてベストなモデルを選んでくれます（ステップワイズ法）。\r
\r
\`\`\`r\r
# mtcarsデータセット\r
# 最初はすべての変数を入れたフルモデルを作る\r
full_model <- lm(mpg ~ ., data = mtcars)\r
\r
# step関数でAIC最小化 (backward: 変数を減らしていく)\r
best_model <- step(full_model, direction="backward")\r
\r
summary(best_model)\r
\`\`\`\r
\r
## まとめ\r
\r
*   モデル作りは「複雑さ」と「当てはまり」のトレードオフ。\r
*   **AIC** は予測精度重視、**BIC** は真のモデル探索重視。どちらも**小さい方が良い**。\r
*   パラメータを増やせば当てはまり（$R^2$など）は必ず良くなるが、それは「過学習」かもしれない。AICでペナルティを与えて公平に比較しよう。\r
`;export{r as default};
