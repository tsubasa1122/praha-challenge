# 課題 1（実装）

- 課題を集約しているリポジトリはモノレポではないので、特大課題のリポジトリに導入することにした
- lint を設定した PR https://github.com/tsubasa1122/praha-challenge-ddd/pull/6
  - market place の action を参考にして設定してみた
    - https://github.com/marketplace/actions/run-eslint
  - Node.js は`actions/setup-node@v2`を使った
    - https://zenn.dev/rena_h/scraps/6d520f2f3e6ba2
    - キャッシュを有効化してみたけど、アプリケーションが小さいこともあってたいして変わらなかった
  - CI 上では`yarn install`は良くない
    - https://zenn.dev/doaradev/scraps/ed31a308a39cdf
    - https://stackoverflow.com/questions/67754606/github-actions-caching-for-node-js-application-is-not-working
    - `npm install`だと package.json の値を参照して npm が作られるから、別のバージョンのライブラリが紛れ込む恐れがあるらしい
      - `npm ci`を使って lock ファイルを元に node_modules をインストールした方が安全
  - 実際のファイル名と import で指定しているファイル名が異なっていた(大文字・小文字の違い)ことが原因で謎の ESlint エラーに気が付かずハマった
    - https://github.com/tsubasa1122/praha-challenge-ddd/runs/4924285518?check_suite_focus=true
    - ローカルと CI で ESlint の設定が変わる？

# 課題 2（実装）

### サービスコンテナの準備

- ドキュメントを参考にセットアップした
  - https://docs.github.com/ja/actions/using-containerized-services/creating-postgresql-service-containers

### CI のセットアップ

- CI 上で結合テストが行なわれるようにセットアップした
  - https://github.com/tsubasa1122/praha-challenge-ddd/pull/7

# 課題 3（質問）

### ビルド時間を短縮する方法

- node_modules を毎回インストールするのではなくキャッシュする
  - https://zenn.dev/sykmhmh/articles/f58a25207e841e
  - 昔は`actions/cache`を使ってキャッシュする必要があったが、今は[setup-node](https://github.com/actions/setup-node)の cache オプションを使うだけで良くなった
  - https://docs.github.com/ja/actions/advanced-guides/caching-dependencies-to-speed-up-workflows

### github 外のイベントフックする方法

- 参考の記事を参考に `workflow_dispatch`を用いて外部からの HTTP リクエストを受け取って実行するワークフローを作った
  - https://github.com/tsubasa1122/praha-challenge-ddd/blob/b2d405e2d468080248f0b929a020010d860fc86e/.github/workflows/workflow_dispatch.yml
  - `repository_dispatch`ではブランチを指定することができない仕様みたいだったので`workflow_dispatch`を使うことにした
  - 常に main に対してワークフローを実行したいなら`repository_dispatch`を使うと良さそう
  - 実際に利用する場合は、headless CMS で管理しているコンテンツが更新通知を受け取って、ワークフロー API を叩くイメージ
    - `repository_dispatch`なら、event_type: [update_posts]みたいなものを作りそう
  - API を叩く際に必要な personal access token の発行方法 https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

**使い方**

- 以下のような形で API を叩くだけでワークフローが実行される
- document: https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event

```shell
$ curl -XPOST -H "Authorization: token ${PERSONAL_ACCESS_TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/tsubasa1122/praha-challenge-ddd/actions/workflows/workflowP_dispatch.yml/dispatches \
  -d '{"ref":"settings-ci"}'
```

**`workflow_dispatch`と`repository_dispatch`の違い**

- workflow_dispatch
  - 単一 workflow に対してトリガーさせる
  - ブランチ指定が可能
- repository_dispatch
  - リポジトリの複数 workflow に対してトリガーさせる
  - イベントタイプやカスタムイベントをカスタマイズして発行する
- https://swfz.hatenablog.com/entry/2020/07/10/201136

**参考**  
https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event  
https://zenn.dev/mizchi/articles/3117b92a834531361fc8  
https://scrapbox.io/nwtgck/GitHub_Actions%E3%82%92curl%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E5%A4%96%E9%83%A8%E3%81%8B%E3%82%89%E5%AE%9F%E8%A1%8C%E3%81%99%E3%82%8B

### 特定のディレクトリのみ監視する方法

- 以下のような感じで監視したいファイルのパスを指定するだけ
- https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#

```yml
on:
  push:
    paths:
      - "app/src/**"
```

### 特定の job の実行を待つ方法

- main.yml のワークフローが完了したら実行されるワークフローを作成した

  - https://github.com/tsubasa1122/praha-challenge-ddd/blob/4983cdc0559c89836d7387f8ed5057d68b161c06/.github/workflows/after_main_workflow.yml

- github actions はいろんなフックがあって便利
- https://docs.github.com/ja/actions/using-workflows/events-that-trigger-workflows#

### 秘匿性の高い情報を扱う方法

- repository の`settings`タブから［Secrets］を設定する
- yml 側では下記のような感じで参照することができる
- https://docs.github.com/ja/actions/security-guides/encrypted-secrets

```yml
# Secrets側で`PG_PASSWORD`という環境変数を設定する
env:
  PASSWORD: ${{ secrets.PG_PASSWORD }}
```
