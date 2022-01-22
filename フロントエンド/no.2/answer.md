# 課題 1

## Atomic Design とは？

- パーツ・コンポーネント単位で定義していく UI デザイン手法のこと

**メリット**

- コンポーネントが共通化されるので使い回しや修正が楽になる
- 並列作業や分業がしやすくなる

  - StoryBook などを用いれば、UI を先に作って動作確認したりすることができる

- https://note.com/tabelog_frontend/n/n4b8bcb44294c より
- コンポーネントの責務が明確になる
  - 見た目の粒度だけでなく、ロジックの責務も明確にできる(ここは Atomic Design と関係ないかも？)

**デメリット**

- チーム内で認識合わせするのに学習コストが掛かる
- あくまでも概念なので、Atomic Design をそのまま取り入れると実際の開発では合わない部分がある
  - DDD と同じような感じかも？

参考:
https://design.dena.com/design/atomic-design-%E3%82%92%E5%88%86%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%A4%E3%82%82%E3%82%8A%E3%81%AB%E3%81%AA%E3%82%8B  
https://bradfrost.com/blog/post/atomic-web-design/  
https://techblog.yahoo.co.jp/entry/20191203785540/

## 以下の用語説明

### pages

- ページのデータを Templates 層に流し込む
  - ロジックが入る

### templates

- ページ全体のレイアウトを決める
- Pages の最上位
- 同一ページ内で 1 度しか使えない

### organisms

- サービスとして意味のある単位の塊
  - ヘッダー、フッダーなど
- 他の Atoms/Molecules/Organisms や純粋な HTML で構成される
- 独立して成立するコンテンツを提供する
- サービス特有の知識が入り込む？

### molecules

- 一つ以上の Atoms に依存した component
  - 検索フォームなど(atoms で作ったボタンと text フォームを組み合わせる)
- ユーティリティ的な塊

### atoms

- UI を構成する最小単位
  - ボタン、ラベル、タイトル、フォームなど
- 汎用的に使える component

### Question

- template と pages の境目が分かりづらい感じがするが、みんなどうしてるんだろう？
  - template が presentational コンポーネントで page が container コンポーネントの役割？
  - API リクエストを行って良いのは pages？

参考:
https://www.creativevillage.ne.jp/94262

## React における関数コンポーネントとクラスコンポーネントの違い

**関数コンポーネント**
https://codesandbox.io/s/autumn-dew-swhws?file=/src/App.tsx

- 何故か Icon が表示されなかった...

**クラスコンポーネント**
https://codesandbox.io/s/staging-voice-qj52e?file=/src/App.tsx

- 記述が多い
  - constructor や render 周り
  - this の挙動はハマりそう

クラスコンポーネントのデメリット

- this の挙動が不可解で、そのためにコードが冗長になりがち
- minify やホットリローディングなどにおいて、クラスは最適化が困難で動作も不安定
- ライフサイクルメソッドを用いると機能的に関連しているはずのコードがバラバラに記述されることになり、可読性が落ちる
- 状態を分離するのが難しく、ロジックを再利用するのが難しい

参考:
https://ja.reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines  
りあクト！ TypeScript で始めるつらくない React 開発 第 3.1 版

# 課題 2

- Atomic Design の page と Next.js の pages の責務はどう分けた方が良いんだろう？
- tailwind is 楽しい!!
  - 愚直にクラス名を付与するようにするとカオスになるかも...
- Storybook で Tailwind が読み込まれなかったので、下記の記事を参考にした
  - https://fwywd.com/tech/next-storybook-install
- ESlint の設定
  - https://fwywd.com/tech/next-eslint-prettier
- Storybook で next/image を使用するとエラーが出る
  - https://qiita.com/ryichk/items/3470c75b73a9def6b7fa
- next/image と storybook で img としてレンダリングされるものが変わってしまう問題を対処したい...
- AuthorIcon と PostCard 周りのコンポーネントはどう作るのが良い？
- Storybook がちょっと汚いかも？
- Footer の構造がちょっとめんどくさかった

参考:
https://storybook.js.org/blog/get-started-with-storybook-and-next-js/
https://dev.classmethod.jp/articles/tried-to-add-storybook-to-nextjs-project/  
https://tailwindcss.com/docs/guides/nextjs
