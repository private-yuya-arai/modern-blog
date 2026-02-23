const r=`---\r
slug: "glm-chapter11"\r
title: "一般化線形モデル (GLM)：正規分布以外も扱える万能選手"\r
date: "2025-11-16"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "GLM", "ロジスティック回帰", "ポアソン回帰"]\r
excerpt: "「売上個数（カウントデータ）」や「合格/不合格（2値データ）」は、普通の回帰分析では扱えません。分布の種類に合わせてモデルを変形するGLMを解説。"\r
image: "/images/glm.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **購入確率の予測**: ユーザーの行動履歴から、「この商品を*買うか/買わないか*」の確率を予測したいとき（ロジスティック回帰）。\r
*   **需要予測**: 「1日の来店者数」や「タクシーの乗車回数」など、0以上の整数（カウント）を予測するとき（ポアソン回帰）。\r
*   **普通の回帰がうまくいかないとき**: データが歪んでいたり、範囲が決まっていたりして、正規分布の仮定が無理なとき。\r
\r
## GLMの仕組み：分布 + リンク関数\r
\r
普通の線形回帰は、「誤差は**正規分布**に従う」「予測値は $y = ax+b$ そのまま」というモデルでした。\r
GLMはこれを拡張して、以下の3部品で構成されます。\r
\r
1.  **確率分布**: データの種類に合わせて選ぶ（正規、二項、ポアソンなど）。\r
2.  **線形予測子**: 説明変数の足し合わせ ($ax+b$)。\r
3.  **リンク関数**: 線形予測子を、確率分布の平均値パラメータに変換する関数（対数、ロジットなど）。\r
\r
\`\`\`mermaid\r
graph LR\r
    Input["説明変数 X"] --> Linear["線形予測子<br>z = ax + b"]\r
    Linear --> Link["リンク関数 g⁻¹(z)<br>変換"]\r
    Link --> Param["パラメータ μ<br>(平均)"]\r
    Param --> Dist["確率分布<br>(正規・二項・ポアソン)"]\r
    Dist --> Output["目的変数 Y"]\r
\`\`\`\r
\r
## パターン別：どのGLMを使う？\r
\r
| データの種類 | 分布 | リンク関数 | モデル名 | 具体例 |\r
| :--- | :--- | :--- | :--- | :--- |\r
| **連続値** (身長, 売上高) | 正規分布 | 恒等関数 ($y=x$) | 線形回帰 | 身長から体重を予測 |\r
| **2値** (成功/失敗) | **二項分布** | **ロジット関数** | **ロジスティック回帰** | クーポンで買う確率 |\r
| **カウント** (個数, 回数) | **ポアソン分布** | **対数関数** (log) | **ポアソン回帰** | 1日のWebアクセス数 |\r
\r
## Pythonでの実装：ロジスティック回帰\r
\r
「勉強時間」から「合否（0/1）」を予測します。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from sklearn.linear_model import LogisticRegression\r
\r
# データ生成\r
X = np.array([1, 2, 3, 4, 10, 11, 12, 13]).reshape(-1, 1) # 勉強時間\r
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])                   # 合否(0:不合格, 1:合格)\r
\r
# モデル学習\r
model = LogisticRegression()\r
model.fit(X, y)\r
\r
# 予測曲線の描画\r
X_test = np.linspace(0, 15, 100).reshape(-1, 1)\r
y_prob = model.predict_proba(X_test)[:, 1] # 合格する確率\r
\r
plt.scatter(X, y, color='red', label='Data')\r
plt.plot(X_test, y_prob, color='blue', label='Logistic Curve')\r
plt.xlabel("Study Hours")\r
plt.ylabel("Probability of Passing")\r
plt.legend()\r
plt.show()\r
\`\`\`\r
\r
S字カーブ（シグモイド曲線）が描かれ、勉強時間が長くなるほど合格確率が 0 から 1 に近づく様子がわかります。\r
\r
## Rでの実装：ポアソン回帰\r
\r
植物の種子数が、植物のサイズ(x)によってどう変わるかをポアソン回帰で分析します。\r
\r
\`\`\`r\r
# データ生成\r
x <- 1:20\r
lambda <- exp(0.1 * x + 2) # 平均種子数 (対数リンクなのでexpする)\r
y <- rpois(20, lambda)     # ポアソン分布から乱数生成\r
\r
# ポアソン回帰実行 (family=poisson)\r
model <- glm(y ~ x, family = poisson(link = "log"))\r
\r
summary(model)\r
\r
# 予測\r
new_x <- data.frame(x = seq(1, 20, 0.1))\r
pred <- predict(model, new_x, type="response")\r
\r
plot(x, y, main="Poisson Regression")\r
lines(new_x$x, pred, col="red")\r
\`\`\`\r
\r
\`family = poisson\` を指定するだけで、普通の \`lm\` と同じ感覚で実行できます。\r
\r
## まとめ\r
\r
*   データが「正規分布していない」なら、無理に使ってはいけない。\r
*   **2値データ**なら**ロジスティック回帰**。\r
*   **カウントデータ**なら**ポアソン回帰**。\r
*   これらを統一的に扱えるのが **GLM (一般化線形モデル)** という枠組みである。\r
`;export{r as default};
