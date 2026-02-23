const r=`---\r
slug: "sampling-theory-chapter17"\r
title: "標本調査法：偏りのないデータを集める技術"\r
date: "2025-12-12"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "標本調査", "層化抽出法", "クラスター抽出法"]\r
excerpt: "全国調査をするのにお金も時間もない？大丈夫、賢くサンプリングすれば精度は落とさずにコストを劇的に下げられます。層化抽出やクラスター抽出の極意。"\r
image: "/images/sampling.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **市場調査**: 全国民にアンケートするのは無理だが、できるだけ少ない人数で正確な「支持率」や「認知度」を知りたいとき。\r
*   **監査**: 膨大な伝票の中から不正を見つけるために、効率的にチェック対象を選び出したいとき。\r
*   **実験**: 被験者を集める際に、性別や年代の偏りをなくしたいとき。\r
\r
## サンプリング手法の選び方チャート\r
\r
ただのランダム（単純無作為抽出）が基本ですが、状況によってはもっと効率的な方法があります。\r
\r
\`\`\`mermaid\r
graph TD\r
    Start{"母集団の情報はある？"}\r
    \r
    Start -->|名簿すらない| Cluster["クラスター抽出法<br>（ある塊ごと選ぶ）"]\r
    Start -->|名簿はある| Strat{"グループごとの性質は？"}\r
    \r
    Strat -->|グループ内で似ている<br>(男女差などあり)| Stratified["層化抽出法<br>（各グループから必ず選ぶ）"]\r
    Strat -->|特に特徴なし| Simple["単純無作為抽出法<br>（くじ引き）"]\r
    \r
    Stratified --> Merit1["精度アップ！<br>マイノリティも拾える"]\r
    Cluster --> Merit2["コストダウン！<br>調査が楽"]\r
\`\`\`\r
\r
## 各手法の比較\r
\r
| 手法名 | やり方 | メリット | デメリット | 具体例 |\r
| :--- | :--- | :--- | :--- | :--- |\r
| **単純無作為抽出** | 全員からクジ引き | 統計的に一番シンプルで計算が楽。 | 実施コストが高い（全国に散らばる）。 | 全住民からランダムに1000人。 |\r
| **層化抽出法** | 年代・性別などで層に分け、各層から人数比に合わせて抽出。 | **精度が高い**。重要な層を確実に含められる。 | 層ごとの情報が事前に必要。 | 年代構成比に合わせて、20代〜60代から各人数を選ぶ。 |\r
| **クラスター抽出法** | 学校や地域（クラスター）を選び、その**全員**を調査。 | **調査が楽**（1箇所に行けば済む）。 | **精度が低い**（同じ場所の人は似がち）。 | ランダムに選んだ「〇〇小学校」の生徒全員を調査。 |\r
| **多段抽出法** | クラスター抽出して、さらにその中から抽出。 | 現実的な大規模調査のデファクト。 | 計算が複雑になる。 | 市町村を選ぶ $\\rightarrow$ 町丁目を選ぶ $\\rightarrow$ 世帯を選ぶ。 |\r
\r
## Pythonでの実装：層化抽出のシミュレーション\r
\r
ある会社（社員1000人）の意識調査をします。\r
*   部署A（多数派）：800人、満足度ばらつき大\r
*   部署B（少数派）：200人、満足度ばらつき小\r
\r
単純ランダムだと部署Bの人がほとんど選ばれない可能性があります。層化抽出と比較してみましょう。\r
\r
\`\`\`python\r
import numpy as np\r
import pandas as pd\r
\r
# 母集団作成\r
# 部書A: 800人, 平均50, 標準偏差20\r
dept_A = np.random.normal(50, 20, 800)\r
# 部書B: 200人, 平均80, 標準偏差5\r
dept_B = np.random.normal(80, 5, 200)\r
\r
population = pd.DataFrame({\r
    'score': np.concatenate([dept_A, dept_B]),\r
    'dept': ['A']*800 + ['B']*200\r
})\r
\r
true_mean = population['score'].mean()\r
print(f"真の平均満足度: {true_mean:.2f}")\r
\r
# 1. 単純無作為抽出 (n=100)\r
sample_simple = population.sample(100)\r
mean_simple = sample_simple['score'].mean()\r
\r
# 2. 層化抽出 (各層の比率 8:2 に合わせて抽出)\r
sample_A = population[population['dept']=='A'].sample(80)\r
sample_B = population[population['dept']=='B'].sample(20)\r
sample_strat = pd.concat([sample_A, sample_B])\r
mean_strat = sample_strat['score'].mean()\r
\r
print(f"単純抽出の平均: {mean_simple:.2f} (誤差: {mean_simple - true_mean:.2f})")\r
print(f"層化抽出の平均: {mean_strat:.2f} (誤差: {mean_strat - true_mean:.2f})")\r
\`\`\`\r
\r
何度か実行すると、層化抽出の方が誤差が安定して小さい（分散が小さい）ことがわかります。\r
\r
## Rでの実装：surveyパッケージ\r
\r
複雑なサンプリングデータの集計には \`survey\` パッケージが必須です。重み付け（ウェイト）を考慮して正しい平均や分散を出してくれます。\r
\r
\`\`\`r\r
library(survey)\r
\r
# 架空の調査データ\r
# id:人, st:層(strata), wt:ウェイト(逆確率)\r
data <- data.frame(\r
  id = 1:5,\r
  st = c(1, 1, 2, 2, 2),\r
  val = c(10, 11, 20, 22, 21),\r
  wt = c(100, 100, 50, 50, 50) # 層1は100人に1人、層2は50人に1人選ばれた\r
)\r
\r
# 調査デザインの定義\r
design <- svydesign(id = ~1, strata = ~st, weights = ~wt, data = data)\r
\r
# 推定（ウェイトを考慮した平均）\r
svymean(~val, design)\r
\`\`\`\r
\r
## まとめ\r
\r
*   全数調査ができないときは**標本調査**。\r
*   精度を上げたければ、似たもの同士をグループ化して各グループから必ず選ぶ**層化抽出**。\r
*   コストを下げたければ、塊ごと選ぶ**クラスター抽出**（ただし精度は落ちる）。\r
*   大規模調査（国勢調査など）では、これらを組み合わせた**多段抽出**が使われる。\r
`;export{r as default};
