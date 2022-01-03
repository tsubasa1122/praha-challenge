# 課題 1

**cleanup が必要な理由**

- 何らかの外部のデータソースへの購読をセットアップしたいことがある場合、メモリリークが発生しないように不要なリソースを解放するクリーンアップ処理が必要になる(具体例は以下)

  - イベントリスナーの解除
  - タイマー処理のキャンセル
  - DB アクセス後の接続解放
    - データをフェッチして promise が解決する前にコンポーネントがアンマウントされた際のキャンセル処理
      - ネットで検索すると 2 通りある [clean-up 関数を理解する](https://www.chotto.dev/ja-JP/clean-up)
      - boolean 値を使った方法
        - true の時だけ、API から取得したデータを setState する(データ取得自体は行う)
      - AbortController を使った方法
        - API リクエストをキャンセルする(ユーザーにとっては無駄なリクエストが無くなるので、エコ)

- POST などでデータの登録を行うだけの場合はクリーンアップ処理は必要ない

### メモ

- axios の API キャンセル処理は後で試してみる
  - https://axios-http.com/docs/cancellation
- API のクリーンアップ処理はあんまりコード見ないけど、みんなどうしているんだろう？
  - そもそもデータ一覧表示などがほとんどで、データを取得中にコンポーネントをアンマウントするユースケースがないから問題が起きてないだけ？

参考:
https://morioh.com/p/83538caf83ba

**useEffect の挙動について**

- 何も指定しなかった場合

  - コンポーネントがレンダリングされる度に実行される
    - 無限ループに陥る恐れがあるので注意が必要

- 空の配列（[]）を指定した場合
  - 初回のレンダリング時のみ実行される

# 課題 2

SomeComponent を完成させた
https://codesandbox.io/s/use-effect-demo-forked-34sl4?file=/src/some-component.js

- コンポーネント内で定義した state(count)を useEffect 内で更新すると、レンダリングする度に count の値が変わるので、再びレンダリングされてしまい、無限ループ状態になってしまう
  - state は更新しても、再レンダリングさせたくない場合は useRef を使用する
    - `useRef は中身が変更になってもそのことを通知しない`

参照:
https://zenn.dev/luvmini511/articles/7e1afa2ca8bdc8  
https://ja.reactjs.org/docs/hooks-reference.html#useref

# 課題 3

fetch-component を完成させた
https://codesandbox.io/s/use-effect-demo-forked-34sl4?file=/src/fetch-component.js

- abort も実装してみた

参考:
https://ja.javascript.info/fetch-abort

# 課題 4

useEffect に関するクイズを作成してください
