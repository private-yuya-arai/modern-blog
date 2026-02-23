const r=`---\r
slug: "stochastic-processes-chapter16"\r
title: "確率過程（発展）：時間とともに移ろう確率分布の世界"\r
date: "2025-12-08"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "確率過程", "マルコフ連鎖", "ブラウン運動"]\r
excerpt: "今日の天気は明日の天気に影響する。未来が確率的に決まるシステム「確率過程」。マルコフ連鎖やランダムウォークをシミュレーションして理解しよう。"\r
image: "/images/stochastic.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **ページランク**: Google検索の根幹アルゴリズム。Webページを飛び回るランダムサーファーの確率分布を計算するとき。\r
*   **待ち行列理論**: レジの混雑シミュレーション。「客がランダムに来て、処理にランダムな時間がかかる」システムを設計するとき。\r
*   **株価の動き**: ランダムウォーク（ブラウン運動）として株価変動をモデル化するとき。\r
\r
## 確率過程の分類マップ\r
\r
「時間」と「状態（値）」が、とびとび（離散）か連続かで4つに分類されます。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start{"時間は？"}\r
    \r
    Start -->|離散 (ステップごと)| TimeD{"値は？"}\r
    TimeD -->|離散 (状態A,B,C)| Markov["マルコフ連鎖<br>(すごろく)"]\r
    TimeD -->|連続 (実数値)| RandomWalk["ランダムウォーク"]\r
    \r
    Start -->|連続 (常に変化)| TimeC{"値は？"}\r
    TimeC -->|離散 (回数など)| PoissonProc["ポアソン過程<br>(客の到着)"]\r
    TimeC -->|連続 (実数値)| Brown["ブラウン運動<br>(微粒子の動き)"]\r
\`\`\`\r
\r
## 1. マルコフ連鎖 (Markov Chain)\r
\r
「**明日の状態は、今日の状態だけで決まる**（過去の履歴は忘れる）」という性質を持つモデルです。\r
\r
### 推移確率行列\r
「晴れ→晴れ 70%」「晴れ→雨 30%」のような確率を表にまとめたものです。\r
これを何度も掛け合わせると、**定常分布**（最終的に落ち着く確率分布）が見えてきます。これがGoogleのページランクの正体です。\r
\r
## 2. ポアソン過程 (Poisson Process)\r
\r
「ランダムにお客さんが来る」ような状況です。\r
*   到着間隔は**指数分布**に従う。\r
*   単位時間あたりの到着数は**ポアソン分布**に従う。\r
この2つは同じ現象の裏表です。\r
\r
## Pythonでの実装：マルコフ連鎖シミュレーション\r
\r
「A店」と「B店」を行き来する客の動きをシミュレーションします。\r
$$ P = \\begin{pmatrix} 0.9 & 0.1 \\\\ 0.2 & 0.8 \\end{pmatrix} $$\r
（Aにいる人は90%またAへ、Bにいる人は80%またBへ）\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
\r
# 推移確率行列\r
P = np.array([[0.9, 0.1],\r
              [0.2, 0.8]])\r
\r
# 初期状態 (全員Aにいる: [1.0, 0.0])\r
state = np.array([1.0, 0.0])\r
\r
history = [state]\r
for _ in range(20):\r
    state = state @ P # 行列ベクトル積で1ステップ進める\r
    history.append(state)\r
\r
history = np.array(history)\r
\r
# プロット\r
plt.plot(history[:, 0], label='State A')\r
plt.plot(history[:, 1], label='State B')\r
plt.ylim(0, 1)\r
plt.title("Markov Chain Convergence")\r
plt.xlabel("Step")\r
plt.ylabel("Probability")\r
plt.legend()\r
plt.show()\r
\r
print(f"最終的な分布: A={state[0]:.2f}, B={state[1]:.2f}")\r
# A=0.67, B=0.33 (2:1) に収束するはず\r
\`\`\`\r
\r
## Rでの実装：ランダムウォーク\r
\r
「コインを投げて表なら +1歩、裏なら -1歩」を1000回繰り返した軌跡を描きます。\r
\r
\`\`\`r\r
set.seed(123)\r
n_steps <- 1000\r
\r
# -1 か +1 をランダムに生成\r
steps <- sample(c(-1, 1), n_steps, replace=TRUE)\r
\r
# 累積和をとる＝現在地\r
position <- cumsum(steps)\r
\r
plot(position, type="l", main="Random Walk (1D)", xlab="Time", ylab="Position")\r
abline(h=0, col="red", lty=2)\r
\`\`\`\r
\r
## まとめ\r
\r
*   **マルコフ性**（未来は現在だけで決まる）は、複雑な現象をシンプルにモデル化する強力な仮定。\r
*   マルコフ連鎖は、時間が経てば特定の分布（定常分布）に落ち着くことが多い。\r
*   **ポアソン過程**は、待ち行列や在庫管理など、ランダムな到着を伴うビジネス課題の基礎になる。\r
`;export{r as default};
