# 課題１（実装）

以下のような階層のテーブルを作成した

```
User/{userID} ... ユーザーのマスター
  -- name (string) ... ユーザーの名前
  -- questions (SubCollection) [ ... ユーザーに紐付く課題とそのステータス一覧
    { question (reference): /Question/{questionID}, status (string): 完了 }
  ]

Question/{questionID} ... 課題のマスター
  -- title (string)  ... 課題のタイトル
  -- description (string) ... 課題の詳細
```

- ユーザーには課題のステータスのみを持たせる設計にした
  - reference 型を使用すればマスター側を参照できる
  - 課題を編集するというユースケースがあるので、独立していた方がデータの整合性が取りやすい
  - 課題の量がそこまで多くないことが予想でき、あるユーザーだけの課題一覧というユースケースが存在しないため、分離していてもパフォーマンスに問題が出なそう
  - ユーザーと課題の関連を分離しなかった理由
    - firestore はクライアント側で join する形になるので、出来るだけ join 数を減らしたかった

# 課題 2（実装）

- こちらで作成した

https://github.com/tsubasa1122/firestore-sample-script/pull/1

参考:  
https://firebase.google.com/docs/firestore/query-data/queries  
https://stackoverflow.com/questions/53140913/querying-by-a-field-with-type-reference-in-firestore  
https://zenn.dev/tentel/articles/ea7d5c03e68e6d142d98  
https://zenn.dev/matsuei/articles/908278e0c22eec  
https://qiita.com/momomomo111/items/1c29afa3989829a9e892  
https://qiita.com/kwbt/items/6c0fe424c89a9f7553c1  
https://qiita.com/xx2xyyy/items/4ac3e03f198021e4206a  
https://blog.vivita.io/entry/2019/09/10/070000

# 課題 2（質問）

**NoSQL の正規化**

- どのようなユースケースに対してどのような値を返すかを考えて正規化する
  - ビジネス上の問題とアプリケーションのユースケースを理解することが不可欠
    - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-general-nosql-design.html
  - RDB の時と同様に ER 図(論理設計)を作成し、ユースケースを洗い出してデータのアクセスパターンを設計してから、それぞれを満たせるテーブルを作っていくイメージ
    - https://elastictechdays.info/dynamodb-design/
    - https://qiita.com/_kensh/items/2351096e6c3bf431ff6f#dynamodb-%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AA%E3%83%B3%E3%82%B0%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9
- 逆に RDB はクエリを柔軟にかける(join など)のでデータの整合性や重複したデータを持たないような設計を行う
  - 柔軟なクエリがかける分、パフォーマンスが落ちてしまう

参考:  
https://tech.hey.jp/entry/2020/10/13/101556

**RDBMS を比較した際のメリット・デメリット**

- メリット
  - 早い
    - 複雑なクエリを書かないような設計を行うため、データへのアクセスがしやすくなる
  - アプリケーション側で、マイグレーションなどのスキーマを管理する必要がない
- デメリット
  - 基本的には結果整合性でデータを保持するため、RDB 時と比べてトランザクションなどに気を使う必要がある
  - DB 設計において、ユースケースを事前に洗い出しておく必要があるため、事前の設計をしっかりと考え抜ておく必要がある
    - 後から出てくるユースケースに対応しづらい
    - 柔軟なクエリを組むことができない
