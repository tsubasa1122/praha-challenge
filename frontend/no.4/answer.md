# 課題 1

- `common-component-app/stories/Button.tsx`に作成した

#課題 2

- `common-component-app/stories/Button.stories.tsx`に作成した

# 課題 3

## 文言を children or props で受け取る、どちらを選択した方が良い？

- そもそも children は、事前には子要素を知らない場合でも柔軟に取り扱えるようにするもの
  - https://ja.reactjs.org/docs/composition-vs-inheritance.html

**children で定義するメリット**

- コンポーネントに対する関心事を減らせる
  - props で指定のプロパティを渡す記述を書く必要が無い
- children は ReactNode を渡せるので、文字列だけでなくコンポーネントを丸ごと渡すなどの柔軟に対応できる

**props で定義するメリット**

- 厳密に型を定義できる
  - string が null になることがあるのかなど

### 結論

- 毎回固定の文字列を表示させるだけなら`children`で定義する
- API などから文字列が返ってきて、それを表示させる場合は`props`で定義する

参考:
https://zenn.dev/terrierscript/articles/2018-10-24-react-children  
https://qiita.com/poteko_knnn/items/2a0d9d497dd2f0b42ddb
