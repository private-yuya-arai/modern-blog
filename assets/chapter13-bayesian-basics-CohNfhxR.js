const r=`---\r
slug: "bayesian-basics-chapter13"\r
title: "ベイズ統計の基礎：柔軟な思考でデータを味方につける"\r
date: "2025-11-25"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "ベイズ統計", "MCMC", "共役事前分布"]\r
excerpt: "「確率は頻度ではない、確信度だ」。パラメータ自体を確率変数として扱うベイズ統計。事前分布と事後分布、そして計算を可能にするMCMCの魔法とは？"\r
image: "/images/bayesian.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **データが少ない段階での意思決定**: 新商品を発売した直後でデータが少なくても、過去の類似商品のデータ（事前知識）を使って予測したいとき。\r
*   **パラメータの分布を知りたい**: 単に「平均50」と言うだけでなく、「45〜55に分布している確率が高い」という確率的な幅を知りたいとき。\r
*   **随時更新**: 毎日入ってくるデータを使って、リアルタイムにモデルを賢くしていきたいとき。\r
\r
## 伝統的な統計 vs ベイズ統計\r
\r
| 項目 | 伝統的統計学 (頻度論) | ベイズ統計学 |\r
| :--- | :--- | :--- |\r
| **パラメータ** | **定数** (神のみぞ知る真の値が1つある) | **確率変数** (分布として揺らいでいる) |\r
| **確率の解釈** | 無限回繰り返した時の頻度の極限 | データから得られた**確信の度合い** |\r
| **推定結果** | 点推定値、信頼区間 | **事後分布** (全体像がわかる) |\r
\r
## ベイズ更新のフロー\r
\r
ベイズ統計は「学習」のプロセスそのものです。\r
\r
\`\`\`mermaid\r
graph TD\r
    Prior --> Posterior\r
    Data --> Posterior\r
    Likelihood --> Posterior["事後分布 P(theta|D)<br>「データを見て考えが変わった！」<br>(更新された知識)"]\r
    \r
    Posterior -->|次のステップへ| NextPrior["次の事前分布"]\r
\`\`\`\r
\r
$$ \\underbrace{P(\\theta | D)}_{事後分布} \\propto \\underbrace{P(D | \\theta)}_{尤度} \\times \\underbrace{P(\\theta)}_{事前分布} $$\r
\r
## 計算の壁とMCMC (マルコフ連鎖モンテカルロ法)\r
\r
事後分布を数式できれいに解くのは、積分計算が難しすぎて不可能なことが多いです。\r
そこで、**「サイコロを振りまくって（乱数シュミレーション）、事後分布の形を浮かび上がらせる」**という力技を使います。これが **MCMC** です。\r
\r
*   **Stan** や **PyMC** といったツールがこれを自動でやってくれます。\r
\r
## Pythonでの実装：PyMCによるベイズ推定\r
\r
「コイン投げで表が出る確率 $p$」を推定します。データは「10回投げて8回表 ($N=10, k=8$)」です。\r
データが少ないですが、事前知識（事前分布）として「コインだから普通は0.5くらいだろう」という情報を入れるか、「何も知らない（一様分布）」とするかで結果が変わります。\r
\r
\`\`\`python\r
import pymc as pm\r
import arviz as az\r
import matplotlib.pyplot as plt\r
\r
# データ: 10回中8回表\r
n_trials = 10\r
n_heads = 8\r
\r
with pm.Model() as model:\r
    # 1. 事前分布: 何も知らないので一様分布 Beta(1, 1) = Uniform(0, 1)\r
    # もし「公平なコインっぽい」と知っていれば Beta(10, 10) などにする\r
    p = pm.Beta('p', alpha=1, beta=1)\r
    \r
    # 2. 尤度: 二項分布\r
    obs = pm.Binomial('obs', n=n_trials, p=p, observed=n_heads)\r
    \r
    # 3. MCMC実行 (サンプリング)\r
    trace = pm.sample(1000, chains=2)\r
\r
# 結果の可視化\r
az.plot_posterior(trace)\r
plt.show()\r
\`\`\`\r
\r
結果分布（事後分布）の山頂（平均やモード）が、推定された $p$ の値です。$8/10=0.8$ 付近にピークが来ますが、データが少ないので裾野は広くなります。\r
\r
## Rでの実装：解析的に解く（共役事前分布）\r
\r
ベータ分布と二項分布の組み合わせ（共役）なら、MCMCを使わなくても手計算で解けます。\r
\r
*   事前分布: $Beta(\\alpha, \\beta)$\r
*   データ: $n$回中$k$回成功\r
*   事後分布: $Beta(\\alpha + k, \\beta + n - k)$\r
\r
\`\`\`r\r
# グリッドを作って密度関数を描画\r
p_grid <- seq(0, 1, length.out=100)\r
\r
# 事前分布 Beta(1, 1) = 一様分布\r
prior <- dbeta(p_grid, 1, 1)\r
\r
# 事後分布 Beta(1+8, 1+2) = Beta(9, 3)\r
posterior <- dbeta(p_grid, 9, 3)\r
\r
plot(p_grid, posterior, type="l", col="red", lwd=3,\r
     main="Bayesian Update", xlab="Probability p", ylab="Density")\r
lines(p_grid, prior, col="blue", lty=2)\r
legend("topleft", legend=c("Prior", "Posterior"),\r
       col=c("blue", "red"), lty=c(2, 1))\r
\`\`\`\r
\r
青い線（平坦）から、赤い線（0.8付近に山）へ、データによって知識が更新された様子がわかります。\r
\r
## まとめ\r
\r
*   **ベイズ統計**は、パラメータを「分布」として捉える。\r
*   **事前分布**（事前の思い込み）と**尤度**（データ）を組み合わせて、**事後分布**（新しい知識）を作る。\r
*   複雑なモデルでも **MCMC**（乱数シミュレーション）を使えば推定できる。これが現代AIの基礎技術の一つになっている。\r
`;export{r as default};
