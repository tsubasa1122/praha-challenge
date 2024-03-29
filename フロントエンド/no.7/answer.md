# 課題１

**SSR, CSR, SSG の違い**

- SSR(サーバーサイドレンダリング)

  - サーバー側でデータを処理して生成した HTML をブラウザにレンダリングする方法
    - 古き良き Web サービスは大体この方法
  - レンダリングのタイミング
    - 毎回クライアントが欲しいページの HTML をサーバー側でレンダリングする
    - CSR に比べて、初回ロードのタイミングでページ全体のデータを読み込む必要がないため、時間は早くなる
  - データ取得のタイミング
    - リクエストの度にサーバー側で処理し、HTML をレンダリングする
      - CSR に比べるとリクエストする度に HTML をサーバー側でレンダリングしている分、遅くなる
        - CSR は仮想 DOM が差分更新をしてくれるから早くなる？あとは JSON でデータをやりとりするのでネットワークの効率が良くなって早くなる？
    - 同期的な処理になるため、ページ遷移の際は他の動作を行うことができない
  - SEO
- 問題なくクローラーがコンテンツを認識してくれる

- CSR(クライアントサイドレンダリング)

  - JavaScript によって、ブラウザにレンダリングする方法
  - ページ遷移する(ネットワークを通じて、ページを取得する)ことなくページ全体を書き換えることができるので、インタラクションが高速になる
  - レンダリングのタイミング
    - 初回のデータ取得時に、ページ全体を描画する JavaScript を読み込む
    - 初回のロードが遅くなりがちだが、その後のインタラクションは高速
  - データ取得のタイミング
    - `XMLHttpRequest`オブジェクトを使って非同期でサーバーと通信するため、ページが読み込まれるまで何も動かせないなどのブロッキングが起こらない
  - SEO
    - 昔のクローラーではコンテンツを取得できないので SEO 的に不利だと言われていたが、今はレンダリングまで待ってくれるみたい(Google クローラー)
      - https://speakerdeck.com/yosuke_furukawa/xing-neng-niguan-surukao-efang?slide=16
      - https://developers.google.com/search/docs/advanced/javascript/javascript-seo-basics?hl=ja
        - CSR は基本的に body のタグを書き換えるイメージが強いので、<head>タグ meta 周りの設定を書き換える処理を忘れずに行うよう注意する必要がある
      - 昔は HTML が空だと認識されてうまくコンテンツをインデックスしてくれなかった
  - OGPの対応が難しい

- SSG(静的サイトジェネレーション)

  - ビルド時に HTML を構築しておき(外部 API からのデータフェッチも行う)、クライアントからのリクエスト時には事前に構築された HTML を返却してブラウザにレンダリングする方法
    - リクエストの度に HTML を生成する処理が発生しない(CSR はクライアント側・SSR はサーバー側で毎回 HTML を生成する処理が発生する)ので、CDN などにキャッシュしておくことで、高速にページを表示することができる
  - レンダリングのタイミング
    - ビルド時にHTMLをレンダリングしておく
    - クライアントは毎回ビルド時に生成されたHTMLを表示する
  - データ取得のタイミング
    - ビルド時に必要なデータを全て取得する
      - ビルドした後に更新されたデータを表示させるためには再びビルドし直す必要がある
  - SEO
    - SSR 同様問題なくクローラーが認識してくれる
    - コンテンツのレスポンスが早くなる分、ユーザー体験が向上し、SEO の評価が高くなる
      - ユーザー体験が良いと SEO 評価も上がる
      - https://developers-jp.googleblog.com/2021/05/core-web-vitals.html

### メモ

- Rails 7 で新しく導入された`Hotwire`が面白い
  - https://zenn.dev/en30/articles/2e8e0c55c128e0

参考:  
https://zenn.dev/akino/articles/78479998efef55  
https://zenn.dev/bitarts/articles/37260ddb28ae5d  
https://qiita.com/cheez921/items/245860c839f7e3a15a69  

# 課題 2

`rendering-test-app`にアプリケーションを作成しました

### ビルドした際のSSGとSSRの差分

- `.next/server/pages` 配下にSSGは`HTML`を生成し、SSRは生成されなかった
  - SSGはビルド時にレンダリングされ、SSRはユーザーからのリクエストの度にレンダリングされるため
  - SSGはこのHTMLを返却するだけで良いので高速化する
    - 逆にAPIから取得するスター数が定数化されてしまっているので、更新するためには再度ビルドする必要がある

### メモ

- Reactのコンポーネントはクライアント側で実行される
  - Next.jsのpages内で`useState`や`useEffect`を使用するとエラーが出る

# 課題 3

**週 1 回更新されるブログ**

- SSGを選択する
  - データの更新頻度が高くなく、整合性はそこまで重要ではないので、SSGと相性が良いから

**ユーザーのコメントが随時追加されるクックパッドのようなサービス**

- SSRを選択する
  - ユーザーからのコメントを随時反映させる必要がある点やC向けのサービスなのでOGPも対応したいから
    - クローラーがJavaScriptのレンダリングを待ってくれるといってもCSRで実装せずに無難にSSRで対応した方がイレギュラーな対応を行う必要がなくなりそう

**freee のような会計サービス**

- CSRを選択する
  - データの更新頻度が高く、整合性が重要で、SEOなどは考慮する必要はない
  - CSR or SSRで迷ったが、会計サービスだと一つのページで複数のインタラクションを実現したいケースが多そう(フォームのバリデーションや入力後の計算結果の表示など)なので、クライアント側で非同期処理を使うことで体験を良くしたい
  - 上記の理由からCSRを選択した

**経営指標（OKR や KPI など）を管理する社内サービス**

- SSR、SSG、CSRどれでも良さそう
  - 社内ツールなので、SEOやOGPを考慮する必要がない
  - データの更新頻度も高くない
    - KPIは日時で更新したいとかはありそうだが、データ量的にそこまで多くないので、SSGを選択して毎日ビルドしてもストレスなさそう
      - ビルドしないとデータ更新されないんですよね〜と経営陣にコミュニケーションしておく必要はありそう...。

**社内 SNS**

- CSR or SSRを選択する
  - 社内ツールなので、SEOやOGPを考慮する必要がなく、データを即時で反映させたいから
  - あとはチーム内の技術スタックによるかも？
