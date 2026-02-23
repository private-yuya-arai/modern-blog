const n=`---\r
slug: "information-entropy-chapter19"\r
title: "情報理論とエントロピー：「驚き」を数値化する"\r
date: "2025-12-21"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "情報理論", "エントロピー", "KL情報量"]\r
excerpt: "「情報量」とは情報のバイト数ではない。「確率が低いこと（驚き）」ほど情報量は大きい。AIの損失関数にも使われるエントロピーやKLダイバージェンスを直感理解。"\r
image: "/images/entropy.png"\r
---\r
\r
> [!NOTE]\r
> **AI Q&A Update (2026/02/24)**: KLダイバージェンスの非対称性についての補足を「KL情報量」セクションに追加しました。\r
\r
## この知識はいつ使うの？\r
\r
*   **決定木 (Decision Tree)**: どの質問（特徴量）でデータを分ければ、一番きれいに分類できるか（情報利得）を計算するとき。\r
*   **機械学習の学習**: モデルの予測分布と真の分布の「ズレ」を最小化したいとき（クロスエントロピー誤差）。\r
*   **モデル選択**: AICの基礎理論として。\r
\r
## 情報量＝驚きの大きさ\r
\r
「明日、太陽が昇る」と言われても、「ふーん（情報量ゼロ）」ですが、「明日、宇宙人が来る」と言われたら「ええっ！？（情報量大）」となります。\r
**確率は低いほど、起きた時の情報量は大きい**と定義します。\r
\r
$$ I(x) = - \\log_2 P(x) $$\r
\r
## エントロピー (Entropy)\r
\r
「平均的にどれくらい驚くか？」つまり「先が読めない度合い（乱雑さ）」のことです。\r
確率分布 $P$ が一様（どれが起きるかわからない）なほどエントロピーは最大になります。\r
\r
\`\`\`mermaid\r
graph LR\r
    Low["確率 100%<br>必ず起きる"] -->|予測カンタン| EntLow["エントロピー 0<br>(秩序)"]\r
    \r
    Mid["確率 90% vs 10%"] -->|まあまあ読める| EntMid["エントロピー 小"]\r
    \r
    High["確率 50% vs 50%<br>半々"] -->|全く読めない！| EntHigh["エントロピー 最大<br>(カオス)"]\r
\`\`\`\r
\r
## KL情報量 (Kullback-Leibler Divergence)\r
\r
<span class="ai-body-highlight">2つの確率分布 $P$（真の分布）と $Q$（モデルの予測分布）が**どれくらい似ていないか（距離のようなもの）**を測る指標です。</span>\r
機械学習では、これを最小にするように学習します。\r
\r
<div class="ai-update-highlight">\r
\r
**2026/02/24 補足: 非対称性について**  \r
KLダイバージェンスは $D_{KL}(P || Q) \\neq D_{KL}(Q || P)$ であるため、数学的な意味での「距離」ではありません。真の分布Pから見てQがどれだけ離れているかを測る、方向性のある指標です。\r
\r
\`\`\`mermaid\r
graph LR\r
    P["真の分布 P"] -->|ズレを測る| Q["モデル Q"]\r
\`\`\`\r
\r
</div>\r
\r
$$ D_{KL}(P || Q) = \\sum P(x) \\log \\frac{P(x)}{Q(x)} $$\r
\r
*   $P=Q$ なら 0。\r
*   似ていないほど大きな値になる。\r
\r
## Pythonでの実装：エントロピーとジニ係数\r
\r
決定木の分岐基準に使われる「エントロピー」と「ジニ係数」を計算して比較します。確率 $p$ が 0.5 のとき（一番混ざっているとき）に最大になることを確認します。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
\r
# 確率 p (クラス1である確率)\r
p = np.linspace(0.01, 0.99, 100)\r
\r
# エントロピー: -p log p - (1-p) log (1-p)\r
entropy = -p * np.log2(p) - (1-p) * np.log2(1-p)\r
\r
# ジニ不純度: 1 - (p^2 + (1-p)^2)\r
gini = 1 - (p**2 + (1-p)**2)\r
\r
# スケール調整してプロット比較\r
plt.figure(figsize=(8, 5))\r
plt.plot(p, entropy, label='Entropy (max=1.0)', color='blue')\r
plt.plot(p, gini, label='Gini Impurity (max=0.5)', color='green', linestyle='--')\r
plt.xlabel("Probability p")\r
plt.ylabel("Inpurity")\r
plt.title("Entropy vs Gini Impurity")\r
plt.legend()\r
plt.grid(True)\r
plt.show()\r
\`\`\`\r
\r
どちらも $p=0.5$ で山なりになります。データの純度（混ざり具合）を測る指標として似た性質を持っています。\r
\r
## Rでの実装：KL情報量の計算\r
\r
2つの正規分布（$P$と$Q$）のズレを計算してみます。\r
\r
\`\`\`r\r
# KL情報量を数値積分で計算する関数\r
kl_divergence <- function(mu1, sigma1, mu2, sigma2) {\r
  f <- function(x) {\r
    p <- dnorm(x, mu1, sigma1)\r
    q <- dnorm(x, mu2, sigma2)\r
    return(p * log(p / q))\r
  }\r
  # -Inf から Inf まで積分\r
  integrate(f, -Inf, Inf)$value\r
}\r
\r
# P: N(0, 1), Q: N(1, 1) -> 少しズレてる\r
kl1 <- kl_divergence(0, 1, 1, 1)\r
\r
# P: N(0, 1), Q: N(0, 1) -> 同じ\r
kl2 <- kl_divergence(0, 1, 0, 1)\r
\r
cat(sprintf("D_KL(N(0,1) || N(1,1)) = %.4f\\n", kl1))\r
cat(sprintf("D_KL(N(0,1) || N(0,1)) = %.4f\\n", kl2))\r
\`\`\`\r
\r
分布が重なっていれば0になり、平均がずれると値が大きくなります。\r
\r
## まとめ\r
\r
*   **情報量**は「珍しさ」の尺度。\r
*   **エントロピー**は「わからなさ（乱雑さ）」の尺度。データ圧縮や決定木で使われる。\r
*   **KL情報量**は分布間の「距離（似てなさ）」。機械学習の損失関数（クロスエントロピー）の正体はこれ。\r
`;export{n as default};
