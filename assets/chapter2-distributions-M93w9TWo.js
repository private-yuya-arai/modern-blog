const n=`---\r
slug: "distributions-chapter2"\r
title: "代表的な確率分布マップ：正規分布からポアソン分布まで"\r
date: "2025-10-05"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "確率分布", "正規分布"]\r
excerpt: "世の中のデータはどんな「形」をしている？データの生成メカニズムを知れば、どの分布を使えばいいかが見えてくる。分布の選び方をチャートで解説。"\r
image: "/images/distributions.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **データの「形」を知りたいとき**: 売上、身長、来店者数など、手元のデータがどのような法則でばらついているかをモデル化する。\r
*   **異常検知**: 「この分布に従うはずなのに、極端に外れた値が出た」として異常を発見する。\r
*   **シミュレーション**: 現実に近いデータをコンピュータ上で生成する。\r
\r
## 分布の選び方チャート\r
\r
データが**離散値（個数など）**なのか、**連続値（身長、時間など）**のかで大きく分かれます。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start{"データの種類は？"}\r
    Start -->|離散値 (回数・個数)| Discrete["離散型分布"]\r
    Start -->|連続値 (量・時間)| Continuous["連続型分布"]\r
\r
    Discrete --> D1{"成功/失敗？"}\r
    D1 -->|1回だけ| Bernoulli["ベルヌーイ分布"]\r
    D1 -->|n回中k回| Binomial["二項分布"]\r
    Discrete --> D2{"稀なイベント？"}\r
    D2 -->|単位時間あたりの発生数| Poisson["ポアソン分布"]\r
\r
    Continuous --> C1{"左右対称？"}\r
    C1 -->|左右対称・釣鐘型| Normal["正規分布"]\r
    C1 -->|裾が重い| Tist["t分布"]\r
    Continuous --> C2{"時間・寿命？"}\r
    C2 -->|ランダムな発生間隔| Expo["指数分布"]\r
    C2 -->|故障までの時間| Gamma["ガンマ分布"]\r
\`\`\`\r
\r
## 1. 離散型確率分布 (Discrete Distributions)\r
\r
サイコロの目や、コインの裏表、来店者数など、**飛び飛びの値**をとる変数です。\r
\r
| 分布名 | 記号 / パラメータ | 使う場面の例 | なぜ重要？ |\r
| :--- | :--- | :--- | :--- |\r
| **ベルヌーイ分布** | $Ber(p)$ | コイン投げ（1回） | すべての基本。成功か失敗か。 |\r
| **二項分布** | $B(n, p)$ | 10回投げて表が出る回数 | ベルヌーイ試行を$n$回繰り返した合計。 |\r
| **ポアソン分布** | $Po(\\lambda)$ | 1時間の来店者数、事故数 | **「滅多に起きない」**イベントの回数予測に必須。 |\r
| **幾何分布** | $Geo(p)$ | 初めて成功するまでの回数 | ガチャで当たりが出るまで何回引くか？ |\r
\r
## 2. 連続型確率分布 (Continuous Distributions)\r
\r
身長、体重、到着までの時間など、**連続的な値**をとる変数です。\r
\r
| 分布名 | 記号 / パラメータ | 使う場面の例 | なぜ重要？ |\r
| :--- | :--- | :--- | :--- |\r
| **正規分布** | $N(\\mu, \\sigma^2)$ | 身長、誤差、テストの点数 | 自然界・人間界で最も一般的。**中心極限定理**により最終的にここに行き着く。 |\r
| **指数分布** | $Exp(\\lambda)$ | 次の客が来るまでの時間 | ポアソン分布と裏表の関係（発生間隔）。「記憶喪失性」を持つ。 |\r
| **一様分布** | $U(a, b)$ | ルーレット、乱数生成 | すべての値が同じ確率で出る。 |\r
\r
## Pythonでの可視化：ポアソン分布と正規分布\r
\r
「滅多に起きないこと（ポアソン）」と「よくあること（正規）」の形のこの違いを見てみましょう。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from scipy.stats import poisson, norm\r
\r
# 設定\r
x_discrete = np.arange(0, 20)\r
x_continuous = np.linspace(-5, 5, 100)\r
\r
plt.figure(figsize=(12, 5))\r
\r
# 1. ポアソン分布 (lambda=3)\r
plt.subplot(1, 2, 1)\r
plt.bar(x_discrete, poisson.pmf(x_discrete, mu=3), alpha=0.7, color='orange')\r
plt.title("Poisson Distribution (lambda=3)")\r
plt.xlabel("Count (k)")\r
plt.ylabel("Probability")\r
\r
# 2. 正規分布 (mean=0, std=1)\r
plt.subplot(1, 2, 2)\r
plt.plot(x_continuous, norm.pdf(x_continuous, 0, 1), color='blue')\r
plt.fill_between(x_continuous, norm.pdf(x_continuous, 0, 1), alpha=0.3, color='blue')\r
plt.title("Normal Distribution (pyramids)")\r
plt.xlabel("Value (x)")\r
plt.ylabel("Density")\r
\r
plt.show()\r
\`\`\`\r
\r
## Rでの可視化：二項分布の形状変化\r
\r
二項分布は、回数 $n$ を増やすと正規分布に近づいていきます（ラプラスの定理）。\r
\r
\`\`\`r\r
par(mfrow=c(1,3))\r
p <- 0.5\r
\r
# n=5, 20, 100 と増やしてみる\r
for (n in c(5, 20, 100)) {\r
  x <- 0:n\r
  prob <- dbinom(x, size=n, prob=p)\r
  plot(x, prob, type="h", lwd=2, main=paste("Binomial n=", n),\r
       xlab="Count", ylab="Probability", col="darkgreen")\r
}\r
\`\`\`\r
\r
## まとめ\r
\r
*   まずは**「離散」か「連続」か**を見極める。\r
*   カウントデータなら**ポアソン分布**、イベント発生間隔なら**指数分布**を疑う。\r
*   迷ったらまずは**正規分布**を当てはめてみるのが定石（多くの統計手法が正規分布を仮定しているため）。\r
`;export{n as default};
