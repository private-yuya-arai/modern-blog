const r=`---\r
slug: "quality-control-chapter18"\r
title: "品質管理と管理図：モノづくりの現場を守る統計学"\r
date: "2025-12-16"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "品質管理", "管理図", "工程能力指数"]\r
excerpt: "日本の製造業を支えてきたQC（品質管理）。「バラツキは敵だ」。異常を素早く検知する管理図の使い方と、工程の実力を測るCp/Cpk指数を解説。"\r
image: "/images/quality.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **製造ラインの監視**: 製品の寸法が規格内に収まっているか、機械の調子が悪くなっていないかを日々チェックしたいとき。\r
*   **ソフトウェア監視**: サーバーのレスポンスタイムやエラー率を監視し、異常なスパイクが起きたらアラートを出したいとき。\r
*   **納品可否の判断**: 作った製品が顧客の要求スペックを満たしているか、統計的に保証したいとき。\r
\r
## 管理図 (Control Chart) の仕組み\r
\r
「偶然のばらつき」と「異常なばらつき」を見分けるためのグラフです。\r
3本の線（中心線CL、上方管理限界UCL、下方管理限界LCL）を引き、データがこの線の外に出たら「異常発生！」とみなします。\r
\r
\`\`\`mermaid\r
graph TD\r
    Data["日々の測定データ"] --> Plot["管理図にプロット"]\r
    \r
    Plot --> Check1{"限界線(UCL/LCL)を<br>超えた？"}\r
    Check1 -- Yes --> Alert["異常！<br>機械を止めろ！"]\r
    Check1 -- No --> Check2{"変な癖はない？<br>(連と傾向)"}\r
    \r
    Check2 -- Yes --> Warning["注意！<br>何かが変わり始めている"]\r
    Check2 -- No --> OK["正常<br>そのまま継続"]\r
\`\`\`\r
\r
### 代表的な管理図の種類\r
\r
| 種類 | 監視するもの | 使うデータの型 |\r
| :--- | :--- | :--- |\r
| **Xbar-R 管理図** | 平均値($\\bar{X}$) と ばらつき($R$) | 連続値（長さ、重さなど） |\r
| **p 管理図** | 不良率 ($p$) | 計数値（〇×判定） |\r
| **c 管理図** | 欠点数 ($c$) | 計数値（傷の数など） |\r
\r
## 工程能力指数 (Cp, Cpk)\r
\r
「今の実力で、規格通りの製品をどれくらい余裕を持って作れるか？」を示すスコアです。\r
\r
*   **Cp**: ばらつきの小ささ（精度）。$Cp > 1.33$ なら優秀。\r
*   **Cpk**: 平均値のズレも考慮した実質的な実力。\r
\r
$$ Cp = \\frac{\\text{規格の幅}}{6 \\times \\text{標準偏差}} $$\r
\r
「規格の幅の中に、標準偏差データが6個分（$\\pm 3\\sigma$）スッポリ入るか？」を見ています。\r
\r
## Pythonでの実装：Xbar-R管理図のシミュレーション\r
\r
データが管理限界を超えた瞬間を検知します。\r
\r
\`\`\`python\r
import numpy as np\r
import matplotlib.pyplot as plt\r
\r
# 正常なデータ (平均10, 標準偏差1)\r
np.random.seed(42)\r
data_normal = np.random.normal(10, 1, 20)\r
\r
# 異常なデータ (平均がずれた！12になった)\r
data_abnormal = np.random.normal(12, 1, 10)\r
\r
data = np.concatenate([data_normal, data_abnormal])\r
\r
# 管理限界線の計算 (簡易的に mean ± 3sigma)\r
mean = np.mean(data[:20]) # 正常期間で基準を作る\r
std = np.std(data[:20])\r
ucl = mean + 3 * std\r
lcl = mean - 3 * std\r
cl = mean\r
\r
plt.figure(figsize=(10, 5))\r
plt.plot(data, 'o-', label='Data')\r
plt.axhline(ucl, color='red', linestyle='--', label='UCL (+3σ)')\r
plt.axhline(lcl, color='red', linestyle='--', label='LCL (-3σ)')\r
plt.axhline(cl, color='green', label='CL (Mean)')\r
\r
# 異常検知\r
outliers = np.where((data > ucl) | (data < lcl))[0]\r
plt.scatter(outliers, data[outliers], color='red', s=100, zorder=5)\r
\r
plt.title("X-bar Control Chart Simulation")\r
plt.legend()\r
plt.show()\r
\`\`\`\r
\r
20番目以降で平均値がズレたため、赤い点線（UCL）を超える点が出てきます。これで異常に気づけます。\r
\r
## Rでの実装：qccパッケージ\r
\r
Rには品質管理専用の優秀なパッケージ \`qcc\` があります。\r
\r
\`\`\`r\r
library(qcc)\r
\r
# ピストンリングの直径データ (pistonrings)\r
data(pistonrings)\r
diameter <- pistonrings$diameter\r
\r
# Xbar-R管理図を作成\r
# 最初の25グループを基準(calibration)とする\r
q <- qcc(diameter[1:25,], type="xbar", newdata=diameter[26:40,])\r
\r
plot(q)\r
\`\`\`\r
\r
自動でUCL/LCLを計算し、さらに「連続して同じ側にある（連）」などのJISルールに基づいた異常判定も色付けしてくれます。\r
\r
## まとめ\r
\r
*   **管理図**は、「放っておいていいばらつき（偶然）」と「対処すべきばらつき（異常）」を分けるツール。\r
*   **$\\pm 3\\sigma$** (99.7%) の範囲を管理限界にするのが世界標準（シューハート管理図）。\r
*   **Cp/Cpk** は工程の「通信簿」。1.33を超えれば合格、1.0を切ると不良品多発の危機。\r
`;export{r as default};
