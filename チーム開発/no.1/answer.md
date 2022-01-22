# 課題 1（質問）

### lint を使う理由

- プロジェクト内もしくは組織内でのコードの書き方を統一することができる
  - コードリーディング時に理解しやすくなる
    - 言語によっては同じ処理でも複数の書き方があるため、ファイルによってコードの書き方が違うと読みづらくなり、理解することが難しくなる
    - コードの書き方の指摘を減らすことができるため、レビューやコミュニケーションのコストを減らすことができる
  - 共通認識ができるので、書き方で迷いが減り、コードを書く速度が上がる
    - 逆に lint のエラーに詰まる場合もあるので、上のメリットは正しいか怪しい
- 非推奨の関数などの使用を防ぐことができる
  - 言語側が推奨しているコードを書くことができる
- 人のレビューだけでは気づかない負債を防いでくれる
  - 使用されていない関数があったら指摘してくれるとか
  - メソッドの行数が一定の数値を超えるとリファクタリングするように指摘してくれるとか
  - 余計な空白が残っていたら指摘してくれるとか
  - lint の設定によって、最低限のコード品質を保つことができる

### ESLint ルール

- https://eslint.org/docs/rules/ を参考に探した
  - `array-callback-return`
    - 配列のコールバックメソッドでは、return を書くことを強制させるオプション
    - ruby 書いてから JavaScript を書くと return を毎回忘れるので、これがあるとありがたい
    - https://eslint.org/docs/rules/array-callback-return
  - `eqeqeq`
    - `===`や`!==`の使用を強制させる
    - 型安全ではない`==`や`!=`の使用を防ぐことができる
    - https://eslint.org/docs/rules/eqeqeq
  - `no-dupe-keys`
    - オブジェクト内に同じキー名が存在していたときに指摘してくれる
    - ほとんど指摘される機会はなさそうだけど、ポカを防ぐために良さそう
    - https://eslint.org/docs/rules/no-dupe-keys
  - `dot-notation`
    - オブジェクトのプロパティへのアクセスを`foo["bar"]`ではなく、`foo.bar`へ強制させる
    - https://eslint.org/docs/rules/dot-notation
  - `comma-spacing`
    - コンマの位置を強制できる
    - 地味に嬉しい
    - https://eslint.org/docs/rules/comma-spacing

### airbnb の lint を入れてみる

- `/lint-sample-app`に create-react-app で React のサンプルアプリを作って、ESlint を導入してみた

  - ただ create-react-app しただけ状態

- ESlint を実行したら下記のようにエラーがたくさん出た

```
$ eslint src/**

/Users/nakanot/Desktop/plactice/praha-challenge/チーム開発/no.1/lint-sample-app/src/App.css
  1:0  error  Parsing error: Unexpected token (1:0)

/Users/nakanot/Desktop/plactice/praha-challenge/チーム開発/no.1/lint-sample-app/src/App.js
   5:5   error  'React' must be in scope when using JSX        react/react-in-jsx-scope
   5:5   error  JSX not allowed in files with extension '.js'  react/jsx-filename-extension
   6:7   error  'React' must be in scope when using JSX        react/react-in-jsx-scope
   7:9   error  'React' must be in scope when using JSX        react/react-in-jsx-scope
  10:11  error  'React' must be in scope when using JSX        react/react-in-jsx-scope
  14:9   error  'React' must be in scope when using JSX        react/react-in-jsx-scope

/Users/nakanot/Desktop/plactice/praha-challenge/チーム開発/no.1/lint-sample-app/src/index.css
  1:4  error  Parsing error: Missing semicolon. (1:4)

/Users/nakanot/Desktop/plactice/praha-challenge/チーム開発/no.1/lint-sample-app/src/index.js
  5:29  error  Unable to resolve path to module './reportWebVitals'  import/no-unresolved
  5:29  error  Missing file extension for "./reportWebVitals"        import/extensions
  8:3   error  JSX not allowed in files with extension '.js'         react/jsx-filename-extension

✖ 11 problems (11 errors, 0 warnings)
```

# 課題 2（実装）

- husky を導入してみた
- https://typicode.github.io/husky/#/?id=automatic-recommendedのコマンド一発で出来た
- モノレポじゃなかったので、テストのために一時的に`git init`した

- ローカル環境での pre-commit の問題点
  - チームメンバーの環境に依存してしまうため、環境によっては pre-commit が正しく動作しない場合がある
  - たとえば、VScode の GUI コミットで動かない不具合が過去にあった
    - https://zenn.dev/nishinama/articles/e1095e7f2e50726c5319
  - `--no-verify`簡単に実行を無視できるので品質を担保することができない
    - 一旦コミットする対応ができないので、TDD やモブプロなどと相性が悪い
