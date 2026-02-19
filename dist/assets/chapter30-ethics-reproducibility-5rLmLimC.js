const r=`---\r
slug: "ethics-reproducibility-chapter30"\r
title: "統計倫理と再現性：データ分析者の「誓い」"\r
date: "2026-02-10"\r
category: "統計学"\r
tags: ["統計検定準一級", "Python", "R", "統計倫理", "p-hacking", "HARKing"]\r
excerpt: "（最終回）「統計で嘘をついてはいけない」。p値を恣意的に操作するp-hackingや、結果を見てから仮説を作るHARKingなど、現代科学が直面する再現性の危機と倫理について考えます。"\r
image: "/images/ethics.png"\r
---\r
\r
## この知識はいつ使うの？\r
\r
*   **全ての分析・実験のとき**: 意図的でなくとも、誤った結論を導かないために常に心に留めておくべきこと。\r
*   **論文を読むとき**: 「この有意差、本当かな？」「p値ハッキングしていないかな？」と批判的に読み解く（クリティカルシンキング）とき。\r
\r
## 再現性の危機 (Replication Crisis)\r
\r
2010年代以降、心理学や医学の分野で「有名な研究結果が、他の人がやっても再現できない」という大問題が発生しました。\r
その主犯格が、不適切な統計学の使い方です。\r
\r
## 禁忌（タブー）カードリスト\r
\r
やってはいけない（でもやりたくなる）行為たちです。\r
\r
| 用語 | 意味 | 何が悪いの？ |\r
| :--- | :--- | :--- |\r
| **p-hacking**<br>(p値ハッキング) | 有意($p<0.05$)になるまで、変数を変えたりデータを足したりして検定を繰り返す。 | 5%の確率で起きる偶然のエラー（偽陽性）を意図的に引き当ててしまう。 |\r
| **HARKing** | **H**ypothesizing **A**fter **R**esults are **K**nown. 結果を見てから、「最初からそう仮説を立てていた」と言う。 | 探索的分析（仮説発見）と検証的分析（仮説検証）をごちゃ混ぜにしている。「後出しジャンケン」。 |\r
| **チェリーピッキング** | 都合の良いデータだけを選ぶ。 | 論外の捏造行為だが、無意識に「外れ値除去」としてやってしまいがち。 |\r
\r
## p-hackingのメカニズム：シミュレーション\r
\r
「本当は差がない」2つのグループをt検定します。\r
一度だけなら5%の確率でしか有意になりませんが、「有意にならなかったらデータを10個追加して再検定」を繰り返すと、偽陽性率はどう跳ね上がるでしょうか？\r
\r
\`\`\`mermaid\r
graph TD\r
    Start["実験スタート"] --> Test1{"p < 0.05 ?"}\r
    Test1 -- はい --> Publish["論文発表！<br>(本来は偽陽性)"]\r
    Test1 -- いいえ --> Add["データを追加する<br>(あと少しで出そう...)"]\r
    \r
    Add --> Test2{"また検定<br>p < 0.05 ?"}\r
    Test2 -- はい --> Publish\r
    Test2 -- いいえ --> Add\r
    \r
    Memo["検定を繰り返すごとに<br>「偶然当たる」確率が累積していく"]\r
\`\`\`\r
\r
## Pythonでの実装：p-hacking実験\r
\r
「有意になるまで粘る」シミュレーションです。\r
\r
\`\`\`python\r
import numpy as np\r
from scipy import stats\r
\r
np.random.seed(42)\r
n_experiments = 1000\r
hacked_success = 0\r
\r
for _ in range(n_experiments):\r
    # 本当は差がない2群\r
    group_A = np.random.normal(0, 1, 100)\r
    group_B = np.random.normal(0, 1, 100)\r
    \r
    # 最初の検定\r
    _, p = stats.ttest_ind(group_A, group_B)\r
    \r
    if p < 0.05:\r
        hacked_success += 1\r
    else:\r
        # p-hacking: 諦めずにデータを10個ずつ追加して最大5回やり直す\r
        current_A, current_B = group_A, group_B\r
        for _ in range(5):\r
            current_A = np.append(current_A, np.random.normal(0, 1, 10))\r
            current_B = np.append(current_B, np.random.normal(0, 1, 10))\r
            _, new_p = stats.ttest_ind(current_A, current_B)\r
            if new_p < 0.05:\r
                hacked_success += 1\r
                break # 勝ったら終わり\r
\r
print(f"通常の偽陽性率（理論値）: 0.05")\r
print(f"p-hacking後の偽陽性率 : {hacked_success / n_experiments:.3f}")\r
\`\`\`\r
\r
実行してみると、偽陽性率が 0.05 ではなく、0.08 〜 0.10 程度まで上昇することがわかります。これは科学的な詐欺になりかねません。\r
\r
## 防衛策：正直な研究のために\r
\r
1.  **事前登録 (Preregistration)**: 「データを見る前に」仮説と分析計画を宣言し、ロックする。\r
2.  **多重性の調整**: たくさんの検定をするなら、有意水準を厳しくする（ボンフェローニ補正など）。\r
3.  **探索と検証の分離**:\r
    *   前半のデータで仮説を探す（探索）。\r
    *   後半のデータで仮説をテストする（検証）。\r
    *   これらを混ぜない！\r
\r
## 講座のまとめ：データ分析の旅路\r
\r
全30章、お疲れ様でした。確率の基礎から始まり、モデリング、そして倫理まで駆け抜けました。\r
\r
*   **記述統計**でデータの顔を見る。\r
*   **推測統計**でデータから世界を推し量る。\r
*   **モデリング**で複雑な現象を構造化する。\r
*   そして、**倫理**を持って正しく使う。\r
\r
これらの武器を使って、あなたの目の前にあるデータから新しい価値を見つけ出してください！\r
Good Luck!\r
`;export{r as default};
