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
  ESLint のルールで揉めないよう、規定の config を読み込む手段もあります。例えば airbnb が提供している ESLint の config は npm パッケージとして提供されています
  https://www.npmjs.com/package/eslint-config-airbnb
  この config を読み込んで、適当なプロジェクトで lint をかけてみましょう

# 課題 2（実装）

ローカル環境で commit を行う際に lint を実行して、もし lint エラーがある場合は commit を禁止するような pre-commit hook を作成してください
言語は node.js でお願いいたします
ヒント：node.js を使ったプロジェクトだと husky をよく見かけます！
こうしたローカル環境での pre-commit で、ある程度の品質は担保できますが、チーム開発をする際、これだけで十分でしょうか？ローカル環境での pre-commit hook には、どんな問題点があるでしょうか？
