# 課題 1

- フックとは、関数コンポーネントに state やライフサイクルといった React の機能を接続するための関数
  - React v.16.8 以前は関数コンポーネントに状態を持たせることができなかった(stateless functional component)
  - フックは State を用いたロジックを再利用するものであって、State 自身は使い回されない

**フックのメリット**

- State を用いたロジックをコンポーネント間で再利用することができる
  - 高階コンポーネントやレンダープロップを用いることで同様の操作を行うことができるが、ツリー内のコンポーネントが増えてしまう
    - ラッパー地獄になる
  - https://ja.reactjs.org/docs/hooks-overview.html#building-your-own-hooks
- 学習コストが低い

  - クラスコンポーネントを使用していた頃は`this`の理解や記述量の多さなど、学ぶ内容が多かった

- ロジックだけを切り出すことができるので、テストが書きやすくなる
  - View が入ると DOM をレンダリングする必要があり、テストしづらい(View は頻繁に変更されるので、テストが壊れやすい)
- ライフサイクルが useEffect に統一されることで、各ライフサイクル(componentDidMount など)で互いに関係のないロジックが紛れ込んでしまっていた問題が解決される

**実務で使えそうなフック**

- [rooks](https://github.com/imbhargav5/rooks) から実務で使用できそうなフックを探してみた
  - [useDebounce](https://react-hooks.org/docs/useDebounce)
    - インクリメントサーチを実装するときに使えそう
  - [usequeuestate](https://react-hooks.org/docs/usequeuestate)
    - フロントで queue 管理ができる
    - ユーザー毎の queue 管理になるからそこまで需要はないかも？
  - [useEffectOnceWhen](https://react-hooks.org/docs/useEffectOnceWhen)
    - 一度しか実行しない処理が一目瞭然なので、良さそう
    - わざわざライブラリを入れなくても、自前で作れば良いかも
  - [useGeolocation](https://react-hooks.org/docs/useGeolocation)
    - 位置情報を取得できる

# 課題 2

下記のようにリファクタリングした
https://codesandbox.io/s/damp-fog-2ro29

# 課題 3

**「Container」と「Presentational」に分けるメリット**

- 1 つコンポーネントに対し、「ロジック」と「UI」の責務を分割することができるので、保守性が高くなる
  - ロジックと UI が混ざったコンポーネントだと見通しが悪くなり可読性が下がる
    - カスタムフックと同じようにロジックの部分だけをテストすることができる(逆にフックがあれば、この設計思想は要らない？)

**デメリット**

- ラップしたコンポーネントを作る分、コンポーネント数が増えることで props リレーも増える

参考:
https://www.nochitoku-it.com/containr-1

# 課題 4

useState に関するクイズを作成してください

No.1

下記のようなコンポーネントがあります。
`+ボタン`を押した際に`count`の値はどうなるでしょうか？

```jsx
import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  const onClickCountUp = () => {
    increment();
    increment();
  };

  return (
    <>
      <p>{count}</p>
      <button onClick={onClickCountUp}>+</button>
    </>
  );
};
```

<details><summary>回答</summary>

count の値は 1 ずつ増加する

state は非同期で更新されるため、今回の記述だと setCount に渡している count の値は直前の state の値ではなく、固定値を渡していることになる(increment 関数を 2 回連続で実行しても、同じ count の値で setCount しているので結果的に 1 回 increment 関数を実行した時と同じ)

**更新後のステートが更新前のステートに依存しているなら、 setState には値ではなく関数を渡してあげる必要がある**

期待値通り、2 ずつ増加させたい場合、increment 関数は以下のように書く必要がある

```js
const increment = () => setCount((prevCount) => prevCount + 1);
```

参考:
https://zenn.dev/stin/articles/use-appropriate-api  
https://chaika.hatenablog.com/entry/2020/01/03/090000

</details>

No.2

下記のコンポーネントのようなフックの使い方は問題ないでしょうか？

```jsx
import { useState } from "react";

const Sample = ({ isAdmin }) => {
  if (isAdmin) {
    const [adminUser, setAdminUser] = useState();
  }

  return <div>テスト</div>;
};
```

<details><summary>回答</summary>

- NG
  - フックを呼び出すのはトップレベルのみで、ループや条件分岐、あるいはネストされた関数内で呼び出してはいけません
    - 関数コンポーネント内で複数の state や副作用を使うことができるが、その state 管理はフックが呼ばれる順番に依存しているため、フックの状態を正しく保持するためにトップレベルのみで呼ぶ必要がある

参考:
https://ja.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level

</details>
