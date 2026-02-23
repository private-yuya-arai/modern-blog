const r=`---\r
slug: "timeseries-basics-chapter9"\r
title: "時系列解析の基礎：自己相関と定常性を理解する"\r
date: "2025-11-06"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "時系列解析", "自己相関", "定常性"]\r
excerpt: "時間の流れに沿ったデータには、独特の「癖」があります。昨日の値が今日に影響する「自己相関」と、解析の前提となる最重要概念「定常性」をマスターしよう。"\r
image: "/images/timeseries.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **株価や売上の分析**: 「昨日の株価が高ければ、今日も高いだろう」というような、時間的な依存関係をモデル化したいとき。\r
*   **トレンドの発見**: データが右肩上がりなのか、季節性（夏に売れるなど）があるのかを分解して理解したいとき。\r
*   **将来予測**: 過去のパターンから来月や来年の数値を予測したいとき。\r
\r
## 時系列データの構造：分解してみよう\r
\r
時系列データは、たいてい3つの要素の足し合わせでできています。\r
\r
\`\`\`mermaid\r
graph TD\r
    Data["観測データ"] --> Trend["トレンド成分<br>(右肩上がり・下がり)"]\r
    Data --> Season["季節成分<br>(1年周期・1週間周期)"]\r
    Data --> Noise["不規則成分<br>(ランダムな誤差)"]\r
    \r
    Trend -->|長期的な動き| Analysis["分析・解釈"]\r
    Season -->|パターンの除去| Analysis\r
    Noise -->|残ったもの| Model["モデル化 (ARIMAなど)"]\r
\`\`\`\r
\r
この「トレンド」や「季節性」が含まれているままだと、統計的な扱かいが難しいです。そこで登場するのが**定常性**という概念です。\r
\r
## 1. 定常性 (Stationarity)\r
\r
「いつ切り取っても、データの確率的な性質（平均や分散）が変わらない」状態のことです。\r
\r
*   **弱定常**: 平均と分散が一定で、共分散が時間差（ラグ）だけに依存する。\r
*   **非定常**: トレンドがあったり（平均が変わる）、振幅がどんどん大きくなったり（分散が変わる）する。\r
\r
多くの時系列モデル（ARモデルなど）は、「データが定常であること」を前提にしています。\r
そのため、非定常なデータは**差分をとる（昨日の値との引き算をする）**などして、無理やり定常にしてから解析します。\r
\r
## 2. 自己相関 (Autocorrelation)\r
\r
「自分自身との相関」です。「1日前（ラグ1）の自分」と「今日の自分」はどれくらい似ているか？を表します。\r
\r
| 指標 | 説明 | 何がわかる？ |\r
| :--- | :--- | :--- |\r
| **自己相関関数 (ACF)** | 時間差 $k$ での相関全て | 季節性の発見（12ヶ月ごとに相関が高いなど）。 |\r
| **偏自己相関関数 (PACF)** | 間の時間の影響を除いた、純粋な時間差 $k$ の相関 | ARモデルの次数 $p$ の決定に使う。 |\r
\r
## Pythonでの実装：成分分解とコレログラム\r
\r
\`statsmodels\` を使えば、時系列データの分解と、自己相関の可視化（コレログラム）が一瞬でできます。\r
\r
\`\`\`python\r
import pandas as pd\r
import numpy as np\r
import matplotlib.pyplot as plt\r
import statsmodels.api as sm\r
\r
# サンプルデータ生成（トレンド + 季節性 + ノイズ）\r
np.random.seed(42)\r
dates = pd.date_range(start='2020-01-01', periods=100, freq='M')\r
trend = np.linspace(0, 10, 100)\r
seasonal = 5 * np.sin(2 * np.pi * np.arange(100) / 12)\r
noise = np.random.normal(0, 1, 100)\r
data = pd.Series(trend + seasonal + noise, index=dates)\r
\r
# 1. 季節調整分解 (STL分解のようなもの)\r
res = sm.tsa.seasonal_decompose(data, model='additive')\r
res.plot()\r
plt.show()\r
\r
# 2. 自己相関(ACF) と 偏自己相関(PACF) のプロット\r
fig, ax = plt.subplots(1, 2, figsize=(12, 4))\r
sm.graphics.tsa.plot_acf(data, lags=24, ax=ax[0])\r
sm.graphics.tsa.plot_pacf(data, lags=24, ax=ax[1])\r
plt.show()\r
\`\`\`\r
\r
コレログラム（ACF）を見ると、12ヶ月ごとの周期的な波（ピーク）が確認でき、季節性があることが視覚的にわかります。\r
\r
## Rでの実装：自己相関の確認\r
\r
Rでは \`acf\` 関数と \`pacf\` 関数が標準で用意されています。\r
\r
\`\`\`r\r
# AirPassengersデータセット（月ごとの航空会社乗客数）\r
data(AirPassengers)\r
\r
par(mfrow=c(2,1))\r
\r
# 自己相関プロット\r
acf(AirPassengers, main="ACF of AirPassengers")\r
# 偏自己相関プロット\r
pacf(AirPassengers, main="PACF of AirPassengers")\r
\`\`\`\r
\r
ACFがゆっくりと減衰しているのはトレンドがある証拠、波打っているのは季節性がある証拠です。\r
\r
## まとめ\r
\r
*   時系列解析の第一歩は、**折れ線グラフ**を描くこと。\r
*   **トレンド**や**季節性**がある場合は「非定常」なので、差分をとるなどの加工が必要。\r
*   **自己相関 (ACF)** を見て、過去の自分が現在にどう影響しているか（周期性など）を確認する。\r
`;export{r as default};
