---
slug: "stochastic-processes-chapter16"
title: "確率過程（発展）：時間とともに移ろう確率分布の世界"
date: "2025-12-08"
category: "統計学"
tags: ["統計検定準一級", "Python", "R", "確率過程", "マルコフ連鎖", "ブラウン運動"]
excerpt: "今日の天気は明日の天気に影響する。未来が確率的に決まるシステム「確率過程」。マルコフ連鎖やランダムウォークをシミュレーションして理解しよう。"
image: "/images/markov.png"
---

## この知識はいつ使うの？

*   **ページランク**: Google検索の根幹アルゴリズム。Webページを飛び回るランダムサーファーの確率分布を計算するとき。
*   **待ち行列理論**: レジの混雑シミュレーション。「客がランダムに来て、処理にランダムな時間がかかる」システムを設計するとき。
*   **株価の動き**: ランダムウォーク（ブラウン運動）として株価変動をモデル化するとき。

## 確率過程の分類マップ

「時間」と「状態（値）」が、とびとび（離散）か連続かで4つに分類されます。

```mermaid
graph TD
    Start{"時間は？"}
    
    Start -->|離散 (ステップごと)| TimeD{"値は？"}
    TimeD -->|離散 (状態A,B,C)| Markov["マルコフ連鎖<br>(すごろく)"]
    TimeD -->|連続 (実数値)| RandomWalk["ランダムウォーク"]
    
    Start -->|連続 (常に変化)| TimeC{"値は？"}
    TimeC -->|離散 (回数など)| PoissonProc["ポアソン過程<br>(客の到着)"]
    TimeC -->|連続 (実数値)| Brown["ブラウン運動<br>(微粒子の動き)"]
```

## 1. マルコフ連鎖 (Markov Chain)

「**明日の状態は、今日の状態だけで決まる**（過去の履歴は忘れる）」という性質を持つモデルです。

### 推移確率行列
「晴れ→晴れ 70%」「晴れ→雨 30%」のような確率を表にまとめたものです。
これを何度も掛け合わせると、**定常分布**（最終的に落ち着く確率分布）が見えてきます。これがGoogleのページランクの正体です。

## 2. ポアソン過程 (Poisson Process)

「ランダムにお客さんが来る」ような状況です。
*   到着間隔は**指数分布**に従う。
*   単位時間あたりの到着数は**ポアソン分布**に従う。
この2つは同じ現象の裏表です。

## Pythonでの実装：マルコフ連鎖シミュレーション

「A店」と「B店」を行き来する客の動きをシミュレーションします。
$$ P = \begin{pmatrix} 0.9 & 0.1 \\ 0.2 & 0.8 \end{pmatrix} $$
（Aにいる人は90%またAへ、Bにいる人は80%またBへ）

```python
import numpy as np
import matplotlib.pyplot as plt

# 推移確率行列
P = np.array([[0.9, 0.1],
              [0.2, 0.8]])

# 初期状態 (全員Aにいる: [1.0, 0.0])
state = np.array([1.0, 0.0])

history = [state]
for _ in range(20):
    state = state @ P # 行列ベクトル積で1ステップ進める
    history.append(state)

history = np.array(history)

# プロット
plt.plot(history[:, 0], label='State A')
plt.plot(history[:, 1], label='State B')
plt.ylim(0, 1)
plt.title("Markov Chain Convergence")
plt.xlabel("Step")
plt.ylabel("Probability")
plt.legend()
plt.show()

print(f"最終的な分布: A={state[0]:.2f}, B={state[1]:.2f}")
# A=0.67, B=0.33 (2:1) に収束するはず
```

## Rでの実装：ランダムウォーク

「コインを投げて表なら +1歩、裏なら -1歩」を1000回繰り返した軌跡を描きます。

```r
set.seed(123)
n_steps <- 1000

# -1 か +1 をランダムに生成
steps <- sample(c(-1, 1), n_steps, replace=TRUE)

# 累積和をとる＝現在地
position <- cumsum(steps)

plot(position, type="l", main="Random Walk (1D)", xlab="Time", ylab="Position")
abline(h=0, col="red", lty=2)
```

## まとめ

*   **マルコフ性**（未来は現在だけで決まる）は、複雑な現象をシンプルにモデル化する強力な仮定。
*   マルコフ連鎖は、時間が経てば特定の分布（定常分布）に落ち着くことが多い。
*   **ポアソン過程**は、待ち行列や在庫管理など、ランダムな到着を伴うビジネス課題の基礎になる。
