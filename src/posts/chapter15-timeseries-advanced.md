---
slug: "timeseries-advanced-chapter15"
title: "時系列解析（発展）：ARIMAモデルで未来を予測する"
date: "2025-12-03"
category: "統計学"
tags: ["統計検定準一級", "Python", "R", "時系列解析", "ARIMA", "SARIMA"]
excerpt: "過去のデータから未来を描く。「昨日の値」と「過去の誤差」を組み合わせて数理モデル化するARIMAモデルを構築し、Python/Rで将来予測を行います。"
image: "/images/timeseries-advanced.png"
---

## この知識はいつ使うの？

*   **来月の売上予測**: 単なるトレンドラインではなく、季節性や直近の変動パターン考慮して、より精密に予測したいとき。
*   **在庫管理**: 「来週は何個売れるか？」を予測して、発注数を決めたいとき。
*   **異常検知**: 予測モデルによる予測値から大きく外れた値を「異常」として検知したいとき。

## ARIMAモデルの系譜

時系列モデルは、レゴブロックのように機能を足していくことで進化してきました。

```mermaid
graph TD
    Start["ホワイトノイズ<br>(ただのランダム)"]
    
    Start --> AR["ARモデル<br>自己回帰<br>「過去の値」に依存"]
    Start --> MA["MAモデル<br>移動平均<br>「過去の誤差」に依存"]
    
    AR & MA --> ARMA["ARMAモデル<br>両方の性質を持つ"]
    
    ARMA -->|差分をとる<br>(トレンド除去)| ARIMA["ARIMAモデル<br>非定常データもOK"]
    
    ARIMA -->|季節性を追加| SARIMA["SARIMAモデル<br>12ヶ月周期などに対応"]
```

## 各モデルの式とイメージ

| モデル | 数式 (イメージ) | 意味 |
| :--- | :--- | :--- |
| **AR(p)** | $y_t = 0.8 y_{t-1} + \epsilon$ | 今日の値は、昨日の値の0.8倍くらいになる。 |
| **MA(q)** | $y_t = \epsilon_t + 0.5 \epsilon_{t-1}$ | 今日の値は、昨日の「予想外のショック」の影響も引きずる。 |
| **ARIMA** | $\Delta y_t = \dots$ | 差分（変化量）をとってからARMAする。トレンドがある時に使う。 |
| **SARIMA** | 複雑 | ARIMAに「昨年の今頃」の影響を加味したもの。最強。 |

## ボックス・ジェンキンス法（構築フロー）

どうやって最適なモデルを見つけるのか？という手順です。

1.  **可視化・定常化**: グラフを描く。トレンドがあれば差分をとる ($d$を決める)。
2.  **識別**: ACF/PACFを見て、ARの次数($p$)とMAの次数($q$)の当たりをつける。
3.  **推定**: パラメータを計算する（AICなどで自動選択が主流）。
4.  **診断**: 残差（予測とのズレ）がホワイトノイズになっているかチェック。

## Pythonでの実装：SARIMAモデルによる予測

`statsmodels` を使えば、これらをまとめて実行できます。

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm

# データの準備 (正弦波 + トレンド)
t = np.arange(1, 100)
y = 0.1*t + np.sin(2*np.pi*t/12) + np.random.normal(0, 0.2, 99)
data = pd.Series(y, index=pd.date_range('2020-01-01', periods=99, freq='M'))

# SARIMAモデル構築 (p,d,q)x(P,D,Q,s)
# 周期 s=12 (月次データ)
model = sm.tsa.statespace.SARIMAX(data,
                                order=(1, 1, 1),
                                seasonal_order=(1, 1, 1, 12))
results = model.fit()

# 将来予測 (向こう12ヶ月)
forecast = results.get_forecast(steps=12)
pred_mean = forecast.predicted_mean
pred_ci = forecast.conf_int()

# プロット
plt.figure(figsize=(10, 5))
plt.plot(data, label='Observed')
plt.plot(pred_mean, label='Forecast', color='red')
plt.fill_between(pred_ci.index, pred_ci.iloc[:,0], pred_ci.iloc[:,1], color='pink', alpha=0.3)
plt.title("SARIMA Forecast")
plt.legend()
plt.show()
```

赤い線（予測）が、過去の波の形を引き継いで伸びていれば成功です。

## Rでの実装：Auto ARIMA

Rの `forecast` パッケージにある `auto.arima` は、AICが最小になる最適な $(p, d, q)$ の組み合わせを全自動で探索してくれる神ツールです。実務ではまずこれを使います。

```r
library(forecast)
data(AirPassengers)

# 自動でベストなモデルを選択
fit <- auto.arima(AirPassengers)

# 結果表示 (選ばれた次数が出る)
print(fit)

# 2年分(24ヶ月)先まで予測してプロット
plot(forecast(fit, h=24), main="Auto ARIMA Forecast")
```

## まとめ

*   時系列予測の基本は **ARIMA / SARIMA** モデル。
*   モデルの次数 $(p, d, q)$ を決めるのが難しいが、**AIC** を指標に自動選択させることが多い。
*   予測には「幅（信頼区間）」が付く。未来のことは完全にはわからないので、この幅が重要。
