---
slug: "bootstrap-resampling-chapter28"
title: "ブートストラップ法：自分の靴紐で自分を持ち上げる"
date: "2026-02-01"
category: "統計学"
tags: ["統計検定準一級", "Python", "R", "ブートストラップ", "リサンプリング", "信頼区間"]
excerpt: "「データが1回分しかない？ならコピーして増やせばいいじゃない」。コンピュータのパワーを使って、複雑な公式なしで信頼区間を求める豪快なテクニック。"
image: "/images/bootstrap.png"
---

## この知識はいつ使うの？

*   **難しい統計量の信頼区間**: 「中央値」や「相関係数」の信頼区間を知りたいが、公式が複雑すぎてわからない（または存在しない）とき。
*   **分布がわからないとき**: データが正規分布しているとは到底思えないが、信頼区間を出さないといけないとき。
*   **機械学習**: ランダムフォレスト（バギング）の基礎理論として。

## ブートストラップ法の仕組み

"Pull yourself up by your bootstraps"（靴紐を引っ張って自分を持ち上げる＝自力でなんとかする）という言葉が由来です。

母集団からサンプリングをやり直すのはコストがかかります。
そこで、**「手元の標本」を「母集団のコピー」だとみなして**、そこからさらにサンプリング（復元抽出）を繰り返します。

```mermaid
graph TD
    Data["手元のデータ<br>N=100"] -->|リサンプリング<br>(復元抽出)| Sample1["疑似サンプル1<br>N=100"]
    Data -->|リサンプリング| Sample2["疑似サンプル2<br>N=100"]
    Data -->|...| SampleK["疑似サンプルK<br>N=100"]
    
    Sample1 --> Stat1["統計量1<br>(平均など)"]
    Sample2 --> Stat2["統計量2"]
    SampleK --> StatK["統計量K"]
    
    Stat1 & Stat2 & StatK --> Dist["統計量の分布<br>(ヒストグラム)"]
    Dist --> CI["信頼区間を計算<br>上位2.5%と下位2.5%"]
```

## 手順：何をすればいい？

1.  手元の $n$ 個のデータから、重複を許して $n$ 個選ぶ（復元抽出）。
2.  そのデータで統計量（平均、中央値など）を計算する。
3.  これを1000回〜10000回繰り返す。
4.  できた1000個の統計量を並べて、下から2.5%番目と97.5%番目の値を区間の端とする（パーセンタイル法）。

これだけです。難しい積分も正規分布の表も要りません。

## Pythonでの実装：中央値の信頼区間

中央値の信頼区間の公式はマイナーですが、ブートストラップなら一瞬です。

```python
import numpy as np

# 元データ（歪んだ分布）
data = np.concatenate([np.random.normal(0, 1, 100), np.random.normal(5, 1, 20)])
original_median = np.median(data)

# ブートストラップ実行
n_iterations = 10000
boot_medians = []

for _ in range(n_iterations):
    # 復元抽出 (replace=True)
    resample = np.random.choice(data, size=len(data), replace=True)
    boot_medians.append(np.median(resample))

# 95%信頼区間 (2.5%点 と 97.5%点)
ci_lower = np.percentile(boot_medians, 2.5)
ci_upper = np.percentile(boot_medians, 97.5)

print(f"元の中央値: {original_median:.3f}")
print(f"95%信頼区間: [{ci_lower:.3f}, {ci_upper:.3f}]")
```

## Rでの実装：bootパッケージ

Rには専用の `boot` パッケージがあります。

```r
library(boot)

# 統計量を計算する関数を定義
# (dataと、リサンプリング用のindexを受け取る必要がある)
median_fun <- function(data, indices) {
  return(median(data[indices]))
}

# データ生成
x <- c(rnorm(100), 10, 20) # 外れ値あり

# ブートストラップ実行 (R=1000回)
results <- boot(data=x, statistic=median_fun, R=1000)

print(results)
# 信頼区間の表示
boot.ci(results, type="perc")
```

## まとめ

*   **ブートストラップ法**は、計算力に物を言わせて信頼区間を求める「力技」。
*   **復元抽出**（重複ありで選ぶ）ことがポイント。
*   どんな複雑な統計量でも、プログラムさえ書ければ信頼区間が求まるので、実務家にとっての最強の武器になる。
