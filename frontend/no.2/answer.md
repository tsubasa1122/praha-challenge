## Atomic Designとは？
- パーツ・コンポーネント単位で定義していく UI デザイン手法のこと

**メリット**
- コンポーネントが共通化されるので使い回しや修正が楽になる
- 並列作業や分業がしやすくなる
  - StoryBookなどを用いれば、UIを先に作って動作確認したりすることができる

- https://note.com/tabelog_frontend/n/n4b8bcb44294c より
  - コンポーネントの責務が明確になる
  - 見た目の粒度だけでなく、ロジックの責務も明確にできる(ここはAtomic Designと関係ないかも？)

**デメリット**
- チーム内で認識合わせするのに学習コストが掛かる
- あくまでも概念なので、Atomic Design をそのまま取り入れると実際の開発では合わない部分がある
  - DDDと同じような感じかも？

参考:
https://design.dena.com/design/atomic-design-%E3%82%92%E5%88%86%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%A4%E3%82%82%E3%82%8A%E3%81%AB%E3%81%AA%E3%82%8B  
https://bradfrost.com/blog/post/atomic-web-design/  
https://techblog.yahoo.co.jp/entry/20191203785540/

## 以下の用語説明

### pages
- ページのデータをTemplates層に流し込む
  - ロジックが入る

### templates
- ページ全体のレイアウトを決める
- Pagesの最上位
- 同一ページ内で1度しか使えない

### organisms
- サービスとして意味のある単位の塊
  - ヘッダー、フッダーなど
- 他のAtoms/Molecules/Organismsや純粋なHTMLで構成される
- 独立して成立するコンテンツを提供する
- サービス特有の知識が入り込む？

### molecules
- 一つ以上のAtomsに依存したcomponent
  - 検索フォームなど(atomsで作ったボタンとtextフォームを組み合わせる)
- ユーティリティ的な塊

### atoms
- UIを構成する最小単位
  - ボタン、ラベル、タイトル、フォームなど
- 汎用的に使えるcomponent

### Question
- templateとpagesの境目が分かりづらい感じがするが、みんなどうしてるんだろう？
  - templateがpresentationalコンポーネントでpageがcontainerコンポーネントの役割？
  - APIリクエストを行って良いのはpages？

参考:
https://www.creativevillage.ne.jp/94262

## Reactにおける関数コンポーネントとクラスコンポーネントの違い

**関数コンポーネント**
https://codesandbox.io/s/autumn-dew-swhws?file=/src/App.tsx

- 何故かIconが表示されなかった...

**クラスコンポーネント**
https://codesandbox.io/s/staging-voice-qj52e?file=/src/App.tsx

- 記述が多い
  - constructorやrender周り
  - thisの挙動はハマりそう

クラスコンポーネントのデメリット
- this の挙動が不可解で、そのためにコードが冗長になりがち
- minify やホットリローディングなどにおいて、クラスは最適化が困難で動作も不安定
- ライフサイクルメソッドを用いると機能的に関連しているはずのコードがバラバラに記述されることになり、可読性が落ちる
- 状態を分離するのが難しく、ロジックを再利用するのが難しい

参考:
https://ja.reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines  
りあクト！ TypeScriptで始めるつらくないReact開発 第3.1版　