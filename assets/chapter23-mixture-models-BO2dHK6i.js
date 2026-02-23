const r=`---\r
slug: "mixture-models-chapter23"\r
title: "混合分布モデルとEMアルゴリズム：隠れたグループを見つけ出せ"\r
date: "2026-01-08"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "混合ガウスモデル", "EMアルゴリズム", "クラスタリング"]\r
excerpt: "データの中に複数の「山」が隠れている？ラベルのないデータから自動的にグループを見つけ出す、教師なし学習の代表格「GMM」とそれを解く「EMアルゴリズム」を解説。"\r
image: "/images/mixture.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **顧客セグメンテーション**: 購入履歴データから、「安さ重視層」「品質重視層」のような隠れた客層を自動分類したいとき。\r
*   **画像の色分割**: 写真のピクセルを、「空の色」「森の色」「地面の色」のように似た色ごとの分布に分けたいとき。\r
*   **異常検知**: 正常なデータの分布（複数のパターンの塊）から外れたデータを検知したいとき。\r
\r
## 混合分布モデル (Mixture Model)\r
\r
「データは1つの分布から出ている」のではなく、「**複数のサイコロ（分布）を使い分けて**出てきた」と考えます。\r
\r
*   普通の正規分布モデル：全員が同じ山から生まれた。\r
*   **混合ガウスモデル (GMM)**：男性の山と、女性の山が混ざっている（山が2つある）。\r
\r
\`\`\`mermaid\r
graph TD\r
    Data["観測データ<br>(ごちゃ混ぜ)"] -->|実は...| Hidden{"隠れた分布<br>(潜在変数 z)"}\r
    \r
    Hidden -->|確率 $\\pi_1$| Dist1["分布1<br>(正規分布A)"]\r
    Hidden -->|確率 $\\pi_2$| Dist2["分布2<br>(正規分布B)"]\r
    Hidden -->|確率 $\\pi_3$| Dist3["分布3<br>(正規分布C)"]\r
    \r
    Dist1 --> Mixture\r
    Dist2 --> Mixture\r
    Dist3 -->|合体| Mixture["混合分布<br>(複雑な形の山)"]\r
\`\`\`\r
\r
## EMアルゴリズム：鶏が先か卵が先か\r
\r
GMMを解くには、「どの山に属するか（クラス所属確率）」と「山の形（平均・分散）」の両方を決めないといけませんが、片方が決まらないともう片方も決まりません。\r
そこで、**とりあえず交互に更新して少しずつ正解に近づける**のがEMアルゴリズムです。\r
\r
1.  **Eステップ (Expectation)**: 今のパラメータを使って、「どの山っぽいか」を予想する（ラベル付け）。\r
2.  **Mステップ (Maximization)**: 予想したラベルに基づいて、「山の形（平均・分散）」を更新する。\r
\r
これを収束するまで繰り返します。K-means法の確率版とも言えます。\r
\r
## Pythonでの実装：GMMによるクラスタリング\r
\r
2つの山が重なったデータを生成し、GMMで分離してみます。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from sklearn.mixture import GaussianMixture\r
\r
# データの生成 (2つの山の混合)\r
np.random.seed(0)\r
shifted_gaussian = np.random.randn(200, 2) + np.array([3, 3])\r
standard_gaussian = np.random.randn(200, 2)\r
X = np.concatenate([shifted_gaussian, standard_gaussian])\r
\r
# GMMモデルの学習 (クラスタ数=2)\r
gmm = GaussianMixture(n_components=2, random_state=0)\r
gmm.fit(X)\r
labels = gmm.predict(X)\r
\r
# 可視化\r
plt.figure(figsize=(6, 6))\r
plt.scatter(X[:, 0], X[:, 1], c=labels, s=40, cmap='viridis')\r
plt.title("Gaussian Mixture Model Clustering")\r
plt.xlabel("Feature 1")\r
plt.ylabel("Feature 2")\r
plt.show()\r
\r
# 推定されたパラメータの確認\r
print("推定された平均:\\n", gmm.means_)\r
# [0,0]付近と[3,3]付近になるはず\r
\`\`\`\r
\r
K-means法と違って、丸くないデータ（楕円形など）も柔軟に捉えることができます。\r
\r
## Rでの実装：Mclustパッケージ\r
\r
Rの \`mclust\` パッケージは、最適なクラスター数をBICで自動選択してくれる便利な機能があります。\r
\r
\`\`\`r\r
library(mclust)\r
\r
data(faithful) # イエローストーンの間欠泉データ（噴出時間と待ち時間）\r
\r
# GMMによるクラスタリング（モデル選択も自動）\r
fit <- Mclust(faithful)\r
\r
summary(fit)\r
# 最適なG(成分数)が表示される\r
\r
plot(fit, what = "classification")\r
\`\`\`\r
\r
間欠泉のデータはきれいに2つのクラスター（短い噴出＆短い待ち時間 vs 長い噴出＆長い待ち時間）に分かれることが知られています。\r
\r
## まとめ\r
\r
*   データ分布が複雑なら、**「正規分布を足し合わせる（混合分布）」**ことで表現できる。\r
*   **GMM** は、K-means法よりも柔軟なクラスタリング手法（確率的な割り当てができる）。\r
*   パラメータ推定には **EMアルゴリズム**（期待値ステップと最大化ステップの繰り返し）が使われる。\r
`;export{r as default};
