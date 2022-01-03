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

No.1

useEffect で外部 API から取得したデータをセットする処理を行う場合、クリーンアップ処理は具体的にはどのような対応方法があるでしょうか？
(※課題 3 の問題にクリーンアップ処理を実装するイメージです)

```jsx
import { useEffect, useState } from "react";
const REACT_REPOSITORY_API_URL = "https://api.github.com/repos/facebook/react";

export const FetchComponent = () => {
  const [data, setData] = useState({
    subscribers: 0,
    stars: 0,
  });

  const fetchReactRepositoryData = async () => {
    const response = await fetch(REACT_REPOSITORY_API_URL);
    const newData = await response.json();
    setData({
      subscribers: newData.subscribers_count,
      stars: newData.stargazers_count,
    });
  };

  useEffect(() => {
    fetchReactRepositoryData();
    // ここにクリーンアップ処理を実装する
    return () => {};
  }, []);

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      <p>{data.stars} stars</p>
    </div>
  );
};
```

<details><summary>回答</summary>

**boolean 値を使って、true の時だけ API から取得したデータを setState する(データ取得自体は行う)**

```jsx
import { useEffect, useState } from "react";
const REACT_REPOSITORY_API_URL = "https://api.github.com/repos/facebook/react";

export const FetchComponent = () => {
  const [data, setData] = useState({
    subscribers: 0,
    stars: 0,
  });

  const fetchReactRepositoryData = async (active) => {
    const response = await fetch(REACT_REPOSITORY_API_URL);
    const newData = await response.json();
    if (active) {
      setData({
        subscribers: newData.subscribers_count,
        stars: newData.stargazers_count,
      });
    }
  };

  useEffect(() => {
    let active = true;
    fetchReactRepositoryData(active);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      <p>{data.stars} stars</p>
    </div>
  );
};
```

**AbortController を使用して、API リクエストをキャンセルする**

```jsx
import { useEffect, useState } from "react";
const REACT_REPOSITORY_API_URL = "https://api.github.com/repos/facebook/react";

export const FetchComponent = () => {
  const [data, setData] = useState({
    subscribers: 0,
    stars: 0,
  });

  const fetchReactRepositoryData = async (abortController) => {
    // APIリクエストにabortControllerのsignalを渡す
    const response = await fetch(REACT_REPOSITORY_API_URL, {
      signal: abortController.signal,
    });
    const newData = await response.json();
    setData({
      subscribers: newData.subscribers_count,
      stars: newData.stargazers_count,
    });
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchReactRepositoryData(abortController);

    // abort関数を用いてAPIリクエストをキャンセルする
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <p>ここにReactのGitHubレポジトリに付いたスターの数を表示してみよう</p>
      <p>{data.stars} stars</p>
    </div>
  );
};
```

</details>

No.2

`useEffect`と`useLayoutEffect`の違いはなんでしょうか？

<details><summary>回答</summary>

- `useEffect`は DOM が描画された後に副作用が実行されるが、`useLayoutEffect`は DOM の変更があった後で同期的に副作用が呼び出される
  - DOM のレイアウトを元に実行する処理がある場合は`useLayoutEffect`を使用する
    - 同期的に実行されるので、パフォーマンスを注意する必要がある
  - SPA でよくみられるデータ取得前のレイアウトが見えてしまう原因は`useEffect`が DOM の描画前に実行されるため

参考:
https://ja.reactjs.org/docs/hooks-reference.html#uselayouteffect

</details>
