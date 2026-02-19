---
slug: "missing-data-chapter24"
title: "欠測データ解析：穴あきデータをどう救うか？"
date: "2026-01-13"
category: "統計学"
tags: ["統計検定準一級", "Python", "R", "欠測データ", "多重代入法", "MICE"]
excerpt: "（更新版）欠損値を平均値で埋めるのはもう卒業。なぜデータが欠けているのか（MCAR/MAR/MNAR）を見極め、多重代入法でバイアスなく解析するための完全ガイド。"
image: "/images/missing-data.png"
---

## この知識はいつ使うの？

*   **アンケート分析**: 必須回答じゃない項目が空白だらけだが、回答者の傾向を知りたいとき。
*   **センサーデータ**: 通信エラーで一部の時間帯だけデータが取れていないとき。
*   **臨床試験**: 患者さんが途中で来院しなくなり、検査データが欠けてしまったとき。

## 欠測の3タイプ：なぜ消えた？

対策を決めるには、「なぜデータがないのか（欠測メカニズム）」を知る必要があります。

```mermaid
graph TD
    Start{"欠け方に<br>理由はある？"}
    
    Start -->|全く理由なし<br>(サイコロ)| MCAR["MCAR<br>完全無作為欠測"]
    Start -->|観測データに依存<br>(性別など)| MAR["MAR<br>無作為欠測"]
    Start -->|見えない値に依存<br>(年収そのもの)| MNAR["MNAR<br>無作為でない欠測"]
    
    MCAR --> Action1["リストワイズ除去<br>(行ごと消す)<br>→ OK"]
    MAR --> Action2["多重代入法<br>(推定して埋める)<br>→ 推奨"]
    MNAR --> Action3["モデリング<br>→ 専門家案件"]
```

### 具体例で理解する

*   **MCAR**: コーヒーをこぼしてアンケート用紙が汚れて読めなくなった。（結果とは無関係）
*   **MAR**: 女性の方が体重欄を空白にする傾向がある。（性別というデータで説明できる）
*   **MNAR**: 年収が高い人ほど、年収欄を書かない。（知りたい値そのものが理由）

## 対処法の比較

| 手法 | 内容 | メリット | デメリット |
| :--- | :--- | :--- | :--- |
| **完全ケース分析** | 欠測がある行を全削除。 | 簡単。MCARなら偏りはない。 | データが激減する。MARだと結果が歪む。 |
| **単一代入法** | 平均値などで1回埋める。 | データ数が減らない。 | 「埋めた値」を真実だと勘違いして、**分散を過小評価**（有意になりすぎる）する。 |
| **多重代入法 (MICE)** | 乱数を使って**複数回**埋める。 | 今のスタンダード。統計的に正しい評価ができる。 | 計算と集計の手間がかかる。 |

## Pythonでの実装：MICE (多重代入法)

`sklearn` の `IterativeImputer` を使って、MARデータを補完します。

```python
import numpy as np
import pandas as pd
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# 欠測データの作成 (df_missing)
# ...（省略）...

# MICEによる代入（他の変数の相関を使って埋める）
mice_imputer = IterativeImputer(max_iter=10, random_state=0)
df_imputed_array = mice_imputer.fit_transform(df_missing)

# データフレームに戻す
df_mice = pd.DataFrame(df_imputed_array, columns=df_missing.columns)

print("代入後の平均値:")
print(df_mice.mean())
```

## Rでの実装：miceパッケージ

Rの `mice` パッケージは、代入から解析、結果の統合（プーリング）までを一貫して行える最強ツールです。

```r
library(mice)

data(nhanes) # 欠測ありデータ

# 1. パターンの確認
md.pattern(nhanes)

# 2. 多重代入 (m=5個のデータセットを作る)
imp <- mice(nhanes, m=5, print=FALSE)

# 3. それぞれで回帰分析を実行 (with)
fit <- with(imp, lm(bmi ~ hyp + chl))

# 4. 結果を統合 (pool)  <- これが重要（Rubinのルール）
pooled_fit <- pool(fit)

summary(pooled_fit)
```

プーリングすることで、**「値を埋めたことによる不確実性」**も考慮した標準誤差が得られます。これが単一代入にはない最大のメリットです。

## まとめ

*   「とりあえず平均値埋め」は、我々が思っている以上に結果を狂わせる（p値を信じてはいけなくなる）。
*   データが欠けている理由 (**MCAR/MAR/MNAR**) を考える癖をつける。
*   実務では **多重代入法 (MICE)** がゴールデンスタンダード。
