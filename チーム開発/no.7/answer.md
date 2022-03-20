# 課題 1（質問）

### 使えそうなツールを探してみる

**フロントエンドのエラーと Slack に通知する**

- Sentry, Bugsnag, Rollbar など主要なエラートラッキングツールなら、要件を満たせていそう

  - [Sentry](https://docs.sentry.io/platforms/javascript/)
  - [Bugsnag](https://docs.bugsnag.com/platforms/javascript/)
  - [Rollbar](https://docs.rollbar.com/docs/javascript)

- 個人利用で使うなら何を使えばいいんだろう？むしろ、個人開発だとツール導入しない場合が多いのかな？

**フロントエンドでエラーが発生したら、作業手順、実行環境等の情報を通知する**

- これも Sentry, Bugsnag, Rollbar で良さそう

  - 各ツールが提供しているクラスのオブジェクトを生成する際に操作しているユーザー情報を設定できたり、Source Maps と連携することでどの操作によってクラッシュしたかを紐付けてくれる

**自動的にアプリケーションを再起動しつつ、Slack に通知する**

- 各主要なパブリッククラウドを提供しているサービスであれば対応できそう

  - たとえば、AWS であれば Cloud Watch で監視しながら、閾値を超えたら特定のイベント(今回だと再起動と Slack 通知)を実行することができる
    - https://hacknote.jp/archives/46275/
  - GCP だと、Slack 通知までは簡単にできそうだけど、再起動などは自前で作る必要がありそう
    - https://zenn.dev/waddy/articles/cloud-logging-log-alert

- NewRelic, Datadog, mackerel などの外部モニタリングサービスを使っている場合でも対応できそう

  - アラートの通知は Webhook などで設定する
  - 再起動は各パブリッククラウドサービスに用意されたインテグレーション機能を導入する
    - AWS なら、`Amazon EventBridge`, GCP なら `Eventarc`辺りかな？
      - ここら辺は触ってみないとよくわからなそう

- そもそも閾値を超えたら勝手にサーバーを再起動してしまっていいんだっけ？
  - サービスが使えない状態は防ぎたいが勝手に再起動されて不具合の原因を追えなくなる状態にしたくない
    - ログやモニタリングに必要な情報が出力されている状態であれば、この問題は解決しそう
  - 逆に、再起動されることで起こる不具合はないのか？

**レスポンスタイムが遅いものを可視化し。 Slack に通知する**

- NewRelic, Datadog, mackerel, Scout APM 辺りの APM(Application performance monitoring)サービスを使用することで対応可能
  - NewRelic と Datadog を使っている会社が多いイメージ
    - パフォーマンスだけでなく、インフラ環境全体をオールインワンでモニタリングしてくれる
    - 海外のサービスなので、ユーザーが多くインターネット上に情報が多い
    - この辺りが理由かな？

**スロークエリを可視化して、 Slack に通知する**

- NewRelic なら設定を追加するだけでスロークエリを可視化することができる
  - 通知はいつも通り
  - https://docs.newrelic.com/jp/docs/apm/apm-ui-pages/monitoring/view-slow-query-details/#slowsql_details
- Datadog もいくつか設定すればできそう

  - https://docs.datadoghq.com/ja/integrations/mysql/?tab=host

- 各パブリッククラウドサービスでも対応できそう
  - モニタリング画面を作るのが大変そう
  - ピタゴラスイッチ感覚でいろんなサービスを連携させる必要がありそうなので、外部のモニタリングサービスに任せた方が良さそう

### 監視しておいた方が良いメトリクス

- 外形監視

  - ヘルスチェックなど、外部のインターネットからアプリケーションが正常に動いているか確認する

- フロントエンドのレンダリング速度の監視

  - https://docs.newrelic.com/jp/docs/browser/browser-monitoring/installation/install-browser-monitoring-agent/
  - ユーザー体験が悪くなっていないかチェックする

- SSL の証明書が有効か確認する
  - 気づかずに期限切れしていることがたまにある
