const r=`---\r
slug: "sparse-modeling-chapter22"\r
title: "スパースモデリング：「ゼロ」の美学"\r
date: "2026-01-04"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "スパースモデリング", "Lasso", "圧縮センシング"]\r
excerpt: "「世界はシンプルである」。少数の変数だけで現象を説明するスパースモデリング。MRIの高速化やブラックホール撮影にも使われた、L1ノルムの魔法とは？"\r
image: "/images/sparse.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **要因特定**: 売上に影響する要因が100個候補があるが、本当に大事な5個だけを抜き出したいとき。\r
*   **画像処理**: ノイズだらけの画像から、きれいな元の画像を復元したいとき（圧縮センシング）。\r
*   **解釈性向上**: 複雑すぎるAIモデルではなく、人間が理解できるシンプルなルールを作りたいとき。\r
\r
## L1ノルムとL2ノルム\r
\r
機械学習における「ペナルティ（正則化項）」の与え方には2つの流派があります。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start["誤差を小さくしたい"]\r
    \r
    Start --> L2["L2正則化 (Ridge)<br>二乗の和を足す"]\r
    Start --> L1["L1正則化 (Lasso)<br>絶対値の和を足す"]\r
    \r
    L2 --> Shape2["円形の制約"]\r
    L1 --> Shape1["ひし形の制約<br>(角がある)"]\r
    \r
    Shape2 --> Result2["全体的に小さくする<br>(0にはならない)"]\r
    Shape1 --> Result1["角に当たりやすい<br>→ 係数がちょうど0になる！<br>(スパース化)"]\r
\`\`\`\r
\r
### なぜL1だと0になるのか？（直感的理解）\r
正則化の等高線（ひし形）と、誤差の等高線（楕円）がぶつかる場所が解になります。ひし形は「角（軸上＝値が0の場所）」が尖っているので、そこでぶつかりやすいのです。\r
\r
## 主なスパース推定手法\r
\r
| 手法名 | 特徴 | 使い分け |\r
| :--- | :--- | :--- |\r
| **Lasso** | 基本形。不要な変数をバッサリ0にする。 | まずはこれ。変数選択をしたいとき。 |\r
| **Ridge** | スパースにはならないが、安定する。 | 変数を減らしたくないとき。相関が高い変数が群れであるとき。 |\r
| **Elastic Net** | LassoとRidgeのいいとこ取り。 | 変数選択しつつ、相関のある変数をグループごと残したいとき。 |\r
| **Group Lasso** | 変数をグループ単位で0にする。 | 「ダミー変数セット」など、まとめて選ぶべき変数があるとき。 |\r
\r
## Pythonでの実装：画像のノイズ除去（Total Variation）\r
\r
スパースモデリングの応用として、画像のノイズ除去を行います。隣り合う画素の「差分」がスパースである（＝輪郭以外は平坦である）という仮定を使います。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
from skimage.restoration import denoise_tv_chambolle\r
from skimage import data, img_as_float, util\r
\r
# 画像準備\r
original_img = img_as_float(data.camera())\r
# ノイズを加える\r
noisy_img = util.random_noise(original_img, mode='gaussian', var=0.01)\r
\r
# Total Variation (TV) 正則化によるノイズ除去\r
# 「変化がスパースである」ことを利用して、エッジを残しつつ平滑化\r
denoised_img = denoise_tv_chambolle(noisy_img, weight=0.1)\r
\r
# 表示\r
fig, ax = plt.subplots(1, 3, figsize=(15, 5))\r
ax[0].imshow(original_img, cmap='gray')\r
ax[0].set_title('Original')\r
ax[1].imshow(noisy_img, cmap='gray')\r
ax[1].set_title('Noisy')\r
ax[2].imshow(denoised_img, cmap='gray')\r
ax[2].set_title('TV Denoised (Sparse)')\r
plt.show()\r
\`\`\`\r
\r
## Rでの実装：glmnetによるLasso回帰\r
\r
Rの \`glmnet\` パッケージは、Lasso/Ridge/ElasticNetを高速に解くためのデファクトスタンダードです。\r
\r
\`\`\`r\r
library(glmnet)\r
\r
# データ準備\r
data(mtcars)\r
y <- mtcars$mpg\r
x <- as.matrix(mtcars[, -1]) # mpg以外を説明変数に\r
\r
# Lasso実行 (alpha=1 はLasso, 0はRidge)\r
fit <- glmnet(x, y, alpha=1)\r
\r
# 解パス（Solution Path）のプロット\r
# ペナルティ(lambda)を強めるにつれて、係数が次々と0になって脱落していく様子\r
plot(fit, xvar="lambda", label=TRUE)\r
\r
# 最適なlambdaをCVで探す\r
cv_fit <- cv.glmnet(x, y, alpha=1)\r
plot(cv_fit)\r
log(cv_fit$lambda.min) # ベストなlambda\r
\`\`\`\r
\r
## まとめ\r
\r
*   **スパースモデリング**は、「本質は少数である」という信念に基づく技術。\r
*   **Lasso (L1正則化)** を使うと、変数を自動選択でき、モデルの解釈性が上がる。\r
*   画像処理や信号処理（圧縮センシング）でも、「無駄な情報を削ぎ落とす」ためのコア技術として使われている。\r
`;export{r as default};
