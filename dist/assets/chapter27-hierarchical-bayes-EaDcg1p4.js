const r=`---\r
slug: "hierarchical-bayes-chapter27"\r
title: "階層ベイズモデル：「個」と「全体」の情報を融通し合う"\r
date: "2026-01-27"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "階層ベイズ", "マルチレベルモデル", "縮約推定"]\r
excerpt: "データが少ないAさんは、みんなのデータを少し借りてくる。個人の個性（ランダム効果）と全体の傾向（固定効果）を同時にモデリングする、現代ベイズの極意。"\r
image: "/images/hierarchical.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **店舗ごとの売上分析**: 「オープンしたての店舗」はデータが少なくて予測が不安定。そこで「全店舗の平均的な傾向」を参考にして補正したいとき。\r
*   **個人別マーケティング**: ユーザーごとの反応率を知りたいが、クリック数が数回しかないユーザーが大量にいるとき。\r
*   **教育評価**: 生徒（レベル1）がクラス（レベル2）に属し、クラスが学校（レベル3）に属するような入れ子構造のデータを分析するとき。\r
\r
## 階層モデルの直感的イメージ\r
\r
「アヒルのおもちゃ」を想像してください。\r
\r
1.  **プーリングなし（個別推定）**: 各アヒルがバラバラに動く（データが少ないと暴れる）。\r
2.  **完全プーリング（全体平均）**: 全員を一縛りにして同じ場所に置く（個性が死ぬ）。\r
3.  **階層ベイズ（部分プーリング）**: アヒルたちはゴム紐で「全体の中心」と繋がれている。\r
    *   データが多いアヒルは、紐を引っ張って自分の行きたい場所（個性）に行ける。\r
    *   データが少ないアヒルは、紐に引っ張られて中心（全体平均）に寄る。\r
\r
**「情報の借用 (Borrowing Strength)」** がキーワードです。\r
\r
\`\`\`mermaid\r
graph TD\r
    Hyper["超パラメータ<br>(全店舗の傾向)"] -->|ゴム紐| ParamA["店舗Aのパラメータ"]\r
    Hyper -->|ゴム紐| ParamB["店舗Bのパラメータ"]\r
    Hyper -->|ゴム紐| ParamC["店舗Cのパラメータ"]\r
    \r
    ParamA --> DataA["店舗Aのデータ<br>(少ない)"]\r
    ParamB --> DataB["店舗Bのデータ<br>(多い)"]\r
    ParamC --> DataC["店舗Cのデータ"]\r
    \r
    DataA -.->|引き寄せられる| Hyper\r
    DataB -.->|自立する| ParamB\r
\`\`\`\r
\r
## 固定効果と変量効果\r
\r
| 名前 | 意味 | イメージ |\r
| :--- | :--- | :--- |\r
| **固定効果 (Fixed Effect)** | 全員に共通する効果。「全体平均」。 | どんな店舗でも、気温が上がれば売上は上がる。 |\r
| **変量効果 (Random Effect)** | グループごとの個体差。「ばらつき」。 | 店長の実力や立地によるベースの売上の違い。 |\r
\r
これらを混ぜるので、**一般化線形混合モデル (GLMM)** とも呼ばれます。\r
\r
## Pythonでの実装：PyMCによる階層モデル\r
\r
複数のグループ（工場）があり、製造数が異なる状況で不良品率を推定します。\r
\r
\`\`\`python\r
import pymc as pm\r
import numpy as np\r
\r
# データ生成（工場ごとの不良品率）\r
n_factories = 5\r
n_products = np.array([10, 10, 100, 100, 1000]) # データ数に差がある\r
true_rates = np.array([0.1, 0.4, 0.1, 0.1, 0.1])\r
failures = np.random.binomial(n_products, true_rates)\r
\r
with pm.Model() as hierarchical_model:\r
    # 超パラメータ (全体の傾向)\r
    mu = pm.Normal('mu', 0, 10)\r
    sigma = pm.HalfNormal('sigma', 10)\r
    \r
    # グループごとのパラメータ (個別の傾向)\r
    # 全体の分布 N(mu, sigma) から生成されると仮定\r
    theta_raw = pm.Normal('theta_raw', mu, sigma, shape=n_factories)\r
    p = pm.Deterministic('p', pm.math.sigmoid(theta_raw))\r
    \r
    # 尤度\r
    y = pm.Binomial('y', n=n_products, p=p, observed=failures)\r
    \r
    # 推定\r
    trace = pm.sample(1000, chains=2)\r
\r
pm.plot_forest(trace, var_names=['p'])\r
\`\`\`\r
\r
結果を見ると、データ数（\`n_products\`）が少ない工場（1, 2番目）の推定値の信頼区間は広くなりますが、極端な値（0%や100%）にはならず、全体平均の方へ「縮小（Shrinkage）」されているはずです。\r
\r
## Rでの実装：lme4パッケージ\r
\r
Rでは \`lme4\` や \`brms\` パッケージが非常に強力です。\r
\r
\`\`\`r\r
library(lme4)\r
\r
# sleepstudyデータセット (被験者ごとの反応時間の変化)\r
# Reaction ~ Days (日数経過で反応が遅くなるか？)\r
# (1 + Days | Subject): 被験者ごとに「切片」も「傾き」も違うことを許容する\r
\r
model <- lmer(Reaction ~ Days + (1 + Days | Subject), data = sleepstudy)\r
\r
summary(model)\r
\r
# 個人ごとの推定値 (BLUP)\r
coef(model)$Subject\r
\`\`\`\r
\r
## まとめ\r
\r
*   **階層ベイズ**は、データが少ないグループの推定精度を、全体のデータを使って底上げする技術。\r
*   「個性を認めつつ、行き過ぎは是正する」という、非常にバランスの良い推定ができる（縮約推定）。\r
*   現実のデータはほとんどが**階層構造**（店・人・時間など）をしているため、実務での適用範囲は非常に広い。\r
`;export{r as default};
