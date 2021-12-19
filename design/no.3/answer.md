## 課題１

**エンティティ**

- ドメインオブジェクトを表現するものの一つ
- 値オブジェクトとの違いは、識別子によって同一性判定を行う・可変である(データのライフサイクルがある)

**値オブジェクト（バリューオブジェクト）**

- ドメインオブジェクトを表現するものの一つ
- エンティティとの違いは、値によって同一性判定を行う・不変である

**集約**

- 必ず守りたい強い整合性を持ったオブジェクトのまとまりのこと
- 集約単位でデータの更新を行う

**ユビキタス言語**

- 発見したモデルの言葉を、すべての場所で使うという指針のこと
- ビジネス・プロダクトと一貫した用語を用いることで、意味の損失や認識ずれを無くすことが出来る

**境界づけられたコンテキスト**

- あるモデルを、同じ意味で使い続ける範囲を定義するものです。
- 例えば、「商品」というモデルがあった時、販売時と配送時で必要なデータや命名が変わることがあります。そういった際にコンテキストを分けることで必要なデータや正しい命名を持つことが出来、モデルの肥大化を防いだり、認識ズレを防ぐことが出来ます。

**ドメイン**

- ソフトウェアで問題解決しようとする対象領域

**ドメインサービス**

- 集合に対する操作など、モデルをオブジェクトとして表現すると無理があるもの
- 振る舞いを定義するものなので、状態を持たない

**リポジトリ**

- 集約単位で永続化層へのアクセスを提供するもの
- 強い整合性を守るため、集約単位でデータにアクセスする

※ 前回の課題でリポジトリは集約単位で作るのか、疑問に思っていたが今回の課題を通して解決した

**アプリケーション（ユースケース層と呼ばれることも）**

- ドメインオブジェクトの作成・構築・公開している処理を組み合わせて、ユースケースの実現を行う層

**CQRS**

- 「参照に使用するモデルと更新に使用するモデルを分離する」というアーキテクチャのこと
- DDD の設計パターンを取り入れると、データのアクセスが集約単位になってしまい、パフォーマンスの観点で問題になることがあるため、参照に特価したモデルを取り入れる

**DTO**

- ユースケース層の戻り値専用のクラスのこと(DDD では正確に定義はされていない)
- View にだけ必要なロジックやデータをこのクラスに隠蔽することが出来る

## 課題２

No.1

- 集約の範囲を大きくし過ぎると、どのような問題が生じてしまうでしょうか？

<details><summary>回答</summary>

- 集約毎に 1 つのトランザクションでデータの更新を行うため、範囲を大きくし過ぎるとそれだけロックの範囲も広がるので、デッドロックが起こる可能性が高くなる。

参考: ドメイン駆動設計 モデリング/実装ガイド

</details>