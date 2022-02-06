# 課題 1（質問）

### PR は小さい方が良い理由

- 変更の差分が小さいため、変更後に何か不具合があった時に原因を特定しやすい

  - 動作確認がしやすい
  - 不具合があった時のロールバックがしやすい
    - PR が大きくなる = PR で多くのことをやっている場合が多いため、色々な機能が絡み合ってロールバックし辛くなる

- レビューがしやすくなるので開発速度が上がる

  - 差分が大きい PR はレビューワー的に負荷が大きくなるため、心理的にレビュー着手が遅くなりがちになる
  - レビューも抜け漏れが発生する確率が高くなる
  - こまめに作業の確認ができるため、大きな手戻りを防ぎやすくなる

- 後で PR を見た時に何があったか理解しやすい

  - 過去の PR を調べることはよくある

- 他の人と共同作業しやすくなる

  - コンフリクトが発生し辛くなる
  - 作業を並行して進めやすくなる

- そもそも PR を作る目的が他者にコードを見てしてもらうことで品質向上を測ることだと思うので、他者(自分を含める)が理解しやすい粒度を考えるべき

### コードのコメントに書くべきこと、書くべきでないこと

**コメントに書くべきこと**

- あるコードが存在するのがなぜかという理由 (why)
  - ドメイン上の制約など、コードの処理だけでは背景を理解できない内容などは積極的にコメントに残す
    - 詳しい背景を残したい場合は参考の URL なども一緒に残しておくと良い
      - 例: 〜のライブラリで不具合があるため、〜の処理をしている。issue: URL 本来は〜の状態にしたい
      - ただし、URL はリンクが変わったり、デッドリンクしてしまう恐れがあるため、コメントだけで背景がわかる状態にしておく

**コメントに書くべきでないこと**

- あるコードが何をしているのか (what)
  - 何をしているかはコードを見ればわかることなので、わざわざ書く必要がない
    - クラス名・変数名など、名前付けを意識する
  - 例外として、複雑な処理を行っている場合は何をしているのかを説明するコメントは大いに助けとなるため、コメント OK

参考
https://shuuji3.xyz/eng-practices/review/reviewer/looking-for.html  
https://www.praha-inc.com/lab/posts/code-review

### コミットコメントに書くべきこと、書くべきでないこと

**書くべきこと**

- [t-wada さんの有名なツイート](https://twitter.com/t_wada/status/904916106153828352?s=20)
  - コミットログには Why を書く
    - コミットメッセージは何をしたのか簡潔に記載する
      - 〜ため、〜を変更 or 追加 or 修正
  - コードコメントには Why not を書く
    - 厳密にこの区別をして開発できている人は少なそう
    - コメントには why を書きたい
      - 指定のコード上に明示的に記載できるから
  - 何の目的で何をどのように変更したのか、変更前と変更後を載せたりする

**書くべでないこと**

- `fix`など、抽象的で具体的に何をしたのかわからないこと
  - 複数の変更を 1 コミットに混ぜない
    - 具体的なコメントが書けなくなる

**メモ**

- コミットメッセージは GitHub や GitLab で表示した際に 70 文字程度までしか 1 行に表示されないため、それ以内に納める
  - 読みやすさの観点から 50 文字以内が推奨
  - 仮にこの文字で収まらない場合は変更箇所が多い可能性がある
  - 命令形の現在形で書く
  - prefix に type を付けることで、変更内容が明示的でわかりやすくなる
    - [type 一覧](https://zenn.dev/szn/articles/c43a4f6073f932#type)
- コミット body では、変化の動機を述べ、以前の行動と対比させます。
  - コミットの詳細を載せる
  - チケット番号や URL を書く場合もある
- メッセージと body の間は空行を開ける

参考  
https://www.praha-inc.com/lab/posts/commit-message  
https://gist.github.com/stephenparish/9941e89d80e2bc58a153  
https://zenn.dev/szn/articles/c43a4f6073f932

# 課題 2（実装）

GitHub の PR や Issue にテンプレートを設定する機能があります。実際に作ってみましょう！

- [テンプレートの作り方](https://docs.github.com/ja/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)

  - `.github/ISSUE_TEMPLATE.md`や`.github/PULL_REQUEST_TEMPLATE.md`などのファイルを作成する
  - `.github/ISSUE_TEMPLATE`ディレクトリに`config.yml`を作成して、issue 作成時に自動的に assignee を設定したりできる

- 既に PR テンプレートは作成済み

**issue テンプレート**

- feature 系

```
## 概要

### 背景と目的

### 提案内容

### 期限

### タスク
- [ ] 細かいタスクに分解できているなら書き出す

### 参考URL
```

- bug 系

```
## 概要

### 発生環境
- 環境：
- 端末：

### 再現手順

### ScreenShot(あれば)

### 修正しないとどう困るか

### 原因

### 修正案
```

**PR テンプレート**

- 既存の PR テンプレートをチーム開発をする観点で見直してみました

```
## TL;DR

簡潔に何をしたのか

### やりたいこと

### やったこと

### やらなかったこと

### URL

現象が発生している URL

### ScreenShot

|Before|After|
| --- | --- |
| <!-- Before --> | <!-- After --> |

## 動作確認方法

## 参考URL

関連するイシューや参考した URL など
```

# 課題 3

### チーム開発で効果のありそうな取り組み

**PR を作成したら自動でチームメンバーをレビュワーにアサインする**

- https://docs.github.com/ja/organizations/organizing-members-into-teams/managing-code-review-settings-for-your-team

**Github と Slack を連携する**

- https://slack.com/intl/ja-jp/help/articles/232289568-GitHub-%E3%81%A8-Slack-%E3%82%92%E9%80%A3%E6%90%BA%E3%81%95%E3%81%9B%E3%82%8B
- コメントを流したり、レビュワーとなっている PR を通知したりすることで、タスクの漏れなどを防ぐ

**main などの重要なブランチに直接 push できないようにする**

- https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches
- ほとんど起きることはないけど、間違って push してしまう恐れがあるので...
- レビューが通らないとマージできない仕組みとかも入れると良さそう
