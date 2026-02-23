const n=`---\r
slug: "bootstrap-resampling-chapter28"\r
title: "ブートストラップ法：自分の靴紐で自分を持ち上げる"\r
date: "2026-02-01"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "ブートストラップ", "リサンプリング", "信頼区間"]\r
excerpt: "「データが1回分しかない？ならコピーして増やせばいいじゃない」。コンピュータのパワーを使って、複雑な公式なしで信頼区間を求める豪快なテクニック。"\r
image: "/images/bootstrap.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **難しい統計量の信頼区間**: 「中央値」や「相関係数」の信頼区間を知りたいが、公式が複雑すぎてわからない（または存在しない）とき。\r
*   **分布がわからないとき**: データが正規分布しているとは到底思えないが、信頼区間を出さないといけないとき。\r
*   **機械学習**: ランダムフォレスト（バギング）の基礎理論として。\r
\r
## ブートストラップ法の仕組み\r
\r
"Pull yourself up by your bootstraps"（靴紐を引っ張って自分を持ち上げる＝自力でなんとかする）という言葉が由来です。\r
\r
母集団からサンプリングをやり直すのはコストがかかります。\r
そこで、**「手元の標本」を「母集団のコピー」だとみなして**、そこからさらにサンプリング（復元抽出）を繰り返します。\r
\r
\`\`\`mermaid\r
graph TD\r
    Data["手元のデータ<br>N=100"] -->|リサンプリング<br>(復元抽出)| Sample1["疑似サンプル1<br>N=100"]\r
    Data -->|リサンプリング| Sample2["疑似サンプル2<br>N=100"]\r
    Data -->|...| SampleK["疑似サンプルK<br>N=100"]\r
    \r
    Sample1 --> Stat1["統計量1<br>(平均など)"]\r
    Sample2 --> Stat2["統計量2"]\r
    SampleK --> StatK["統計量K"]\r
    \r
    Stat1 --> Dist\r
    Stat2 --> Dist\r
    StatK --> Dist["統計量の分布<br>(ヒストグラム)"]\r
    Dist --> CI["信頼区間を計算<br>上位2.5%と下位2.5%"]\r
\`\`\`\r
\r
## 手順：何をすればいい？\r
\r
1.  手元の $n$ 個のデータから、重複を許して $n$ 個選ぶ（復元抽出）。\r
2.  そのデータで統計量（平均、中央値など）を計算する。\r
3.  これを1000回〜10000回繰り返す。\r
4.  できた1000個の統計量を並べて、下から2.5%番目と97.5%番目の値を区間の端とする（パーセンタイル法）。\r
\r
これだけです。難しい積分も正規分布の表も要りません。\r
\r
## Pythonでの実装：中央値の信頼区間\r
\r
中央値の信頼区間の公式はマイナーですが、ブートストラップなら一瞬です。\r
\r
\`\`\`python\r
import numpy as np\r
\r
# 元データ（歪んだ分布）\r
data = np.concatenate([np.random.normal(0, 1, 100), np.random.normal(5, 1, 20)])\r
original_median = np.median(data)\r
\r
# ブートストラップ実行\r
n_iterations = 10000\r
boot_medians = []\r
\r
for _ in range(n_iterations):\r
    # 復元抽出 (replace=True)\r
    resample = np.random.choice(data, size=len(data), replace=True)\r
    boot_medians.append(np.median(resample))\r
\r
# 95%信頼区間 (2.5%点 と 97.5%点)\r
ci_lower = np.percentile(boot_medians, 2.5)\r
ci_upper = np.percentile(boot_medians, 97.5)\r
\r
print(f"元の中央値: {original_median:.3f}")\r
print(f"95%信頼区間: [{ci_lower:.3f}, {ci_upper:.3f}]")\r
\`\`\`\r
\r
## Rでの実装：bootパッケージ\r
\r
Rには専用の \`boot\` パッケージがあります。\r
\r
\`\`\`r\r
library(boot)\r
\r
# 統計量を計算する関数を定義\r
# (dataと、リサンプリング用のindexを受け取る必要がある)\r
median_fun <- function(data, indices) {\r
  return(median(data[indices]))\r
}\r
\r
# データ生成\r
x <- c(rnorm(100), 10, 20) # 外れ値あり\r
\r
# ブートストラップ実行 (R=1000回)\r
results <- boot(data=x, statistic=median_fun, R=1000)\r
\r
print(results)\r
# 信頼区間の表示\r
boot.ci(results, type="perc")\r
\`\`\`\r
\r
## まとめ\r
\r
*   **ブートストラップ法**は、計算力に物を言わせて信頼区間を求める「力技」。\r
*   **復元抽出**（重複ありで選ぶ）ことがポイント。\r
*   どんな複雑な統計量でも、プログラムさえ書ければ信頼区間が求まるので、実務家にとっての最強の武器になる。\r
`;export{n as default};
