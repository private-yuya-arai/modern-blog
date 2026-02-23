const r=`---\r
slug: "timeseries-advanced-chapter15"\r
title: "時系列解析（発展）：ARIMAモデルで未来を予測する"\r
date: "2025-12-03"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "時系列解析", "ARIMA", "SARIMA"]\r
excerpt: "過去のデータから未来を描く。「昨日の値」と「過去の誤差」を組み合わせて数理モデル化するARIMAモデルを構築し、Python/Rで将来予測を行います。"\r
image: "/images/timeseries-advanced.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **来月の売上予測**: 単なるトレンドラインではなく、季節性や直近の変動パターン考慮して、より精密に予測したいとき。\r
*   **在庫管理**: 「来週は何個売れるか？」を予測して、発注数を決めたいとき。\r
*   **異常検知**: 予測モデルによる予測値から大きく外れた値を「異常」として検知したいとき。\r
\r
## ARIMAモデルの系譜\r
\r
時系列モデルは、レゴブロックのように機能を足していくことで進化してきました。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start["ホワイトノイズ<br>(ただのランダム)"]\r
    \r
    Start --> AR["ARモデル<br>自己回帰<br>「過去の値」に依存"]\r
    Start --> MA["MAモデル<br>移動平均<br>「過去の誤差」に依存"]\r
    \r
    AR --> ARMA\r
    MA --> ARMA["ARMAモデル<br>両方の性質を持つ"]\r
    \r
    ARMA -->|差分をとる<br>(トレンド除去)| ARIMA["ARIMAモデル<br>非定常データもOK"]\r
    \r
    ARIMA -->|季節性を追加| SARIMA["SARIMAモデル<br>12ヶ月周期などに対応"]\r
\`\`\`\r
\r
## 各モデルの式とイメージ\r
\r
| モデル | 数式 (イメージ) | 意味 |\r
| :--- | :--- | :--- |\r
| **AR(p)** | $y_t = 0.8 y_{t-1} + \\epsilon$ | 今日の値は、昨日の値の0.8倍くらいになる。 |\r
| **MA(q)** | $y_t = \\epsilon_t + 0.5 \\epsilon_{t-1}$ | 今日の値は、昨日の「予想外のショック」の影響も引きずる。 |\r
| **ARIMA** | $\\Delta y_t = \\dots$ | 差分（変化量）をとってからARMAする。トレンドがある時に使う。 |\r
| **SARIMA** | 複雑 | ARIMAに「昨年の今頃」の影響を加味したもの。最強。 |\r
\r
## ボックス・ジェンキンス法（構築フロー）\r
\r
どうやって最適なモデルを見つけるのか？という手順です。\r
\r
1.  **可視化・定常化**: グラフを描く。トレンドがあれば差分をとる ($d$を決める)。\r
2.  **識別**: ACF/PACFを見て、ARの次数($p$)とMAの次数($q$)の当たりをつける。\r
3.  **推定**: パラメータを計算する（AICなどで自動選択が主流）。\r
4.  **診断**: 残差（予測とのズレ）がホワイトノイズになっているかチェック。\r
\r
## Pythonでの実装：SARIMAモデルによる予測\r
\r
\`statsmodels\` を使えば、これらをまとめて実行できます。\r
\r
\`\`\`python\r
import pandas as pd\r
import numpy as np\r
import matplotlib.pyplot as plt\r
import statsmodels.api as sm\r
\r
# データの準備 (正弦波 + トレンド)\r
t = np.arange(1, 100)\r
y = 0.1*t + np.sin(2*np.pi*t/12) + np.random.normal(0, 0.2, 99)\r
data = pd.Series(y, index=pd.date_range('2020-01-01', periods=99, freq='M'))\r
\r
# SARIMAモデル構築 (p,d,q)x(P,D,Q,s)\r
# 周期 s=12 (月次データ)\r
model = sm.tsa.statespace.SARIMAX(data,\r
                                order=(1, 1, 1),\r
                                seasonal_order=(1, 1, 1, 12))\r
results = model.fit()\r
\r
# 将来予測 (向こう12ヶ月)\r
forecast = results.get_forecast(steps=12)\r
pred_mean = forecast.predicted_mean\r
pred_ci = forecast.conf_int()\r
\r
# プロット\r
plt.figure(figsize=(10, 5))\r
plt.plot(data, label='Observed')\r
plt.plot(pred_mean, label='Forecast', color='red')\r
plt.fill_between(pred_ci.index, pred_ci.iloc[:,0], pred_ci.iloc[:,1], color='pink', alpha=0.3)\r
plt.title("SARIMA Forecast")\r
plt.legend()\r
plt.show()\r
\`\`\`\r
\r
赤い線（予測）が、過去の波の形を引き継いで伸びていれば成功です。\r
\r
## Rでの実装：Auto ARIMA\r
\r
Rの \`forecast\` パッケージにある \`auto.arima\` は、AICが最小になる最適な $(p, d, q)$ の組み合わせを全自動で探索してくれる神ツールです。実務ではまずこれを使います。\r
\r
\`\`\`r\r
library(forecast)\r
data(AirPassengers)\r
\r
# 自動でベストなモデルを選択\r
fit <- auto.arima(AirPassengers)\r
\r
# 結果表示 (選ばれた次数が出る)\r
print(fit)\r
\r
# 2年分(24ヶ月)先まで予測してプロット\r
plot(forecast(fit, h=24), main="Auto ARIMA Forecast")\r
\`\`\`\r
\r
## まとめ\r
\r
*   時系列予測の基本は **ARIMA / SARIMA** モデル。\r
*   モデルの次数 $(p, d, q)$ を決めるのが難しいが、**AIC** を指標に自動選択させることが多い。\r
*   予測には「幅（信頼区間）」が付く。未来のことは完全にはわからないので、この幅が重要。\r
`;export{r as default};
