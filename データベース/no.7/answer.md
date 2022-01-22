## 課題１（質問）

### デッドロックの説明

- 2 つのトランザクションがお互いに必要とする資源をロックしあってしまい、どちらも一時停止になってしまう現象。単にロック待ち時間が長時間になっているケースはデッドロックとは言わない。

参考：
https://medium-company.com/%E3%83%87%E3%83%83%E3%83%89%E3%83%AD%E3%83%83%E3%82%AF/  
https://wa3.i-3-i.info/word11317.html

### それぞれの ISOLATION LEVEL について説明と、それぞれの差分、それによってどんな問題が生じる可能性

**ISOLATION LEVEL**

- トランザクションの特性である ACID 属性の内のひとつである ISOLATION(独立性)の水準を表します。独立性を高めるほど同時実行性能が落ち、同時実行性能をあげようとすれば独立性は低くなって不整合が起こる可能性が増えます。

InnoDB は以下の 4 つのトランザクション分離レベルをサポートしています。

- READ UNCOMMITTED
  - コミットされていない変更を他のトランザクションから参照することが出来る。
- READ COMMITTED
  - コミットされた変更を他のトランザクションから参照することが出来る。つまり、コミットされたデータのみしか読み取ることが出来ない。
- REPEATABLE READ
  - コミットされた追加・削除を他のトランザクションから参照することが出来る。繰り返し同じデータを読み取っても、同じデータであることを保証する。
- SERIALIZABLE
  - 強制的にトランザクションを順序付けて処理する。(直列化)

参考：
https://qiita.com/song_ss/items/38e514b05e9dabae3bdb

**差分と問題**

- 分離レベルの差分(起こりうる問題)を以下の図に表しました。

|    分離レベル    | Dirty Read | Non-repeatable Read | Phantom Read |
| :--------------: | :--------: | :-----------------: | :----------: |
| READ UNCOMMITTED |    あり    |        あり         |     あり     |
|  READ COMMITTED  |    なし    |        あり         |     あり     |
| REPEATABLE READ  |    なし    |        なし         |     あり     |
|   SERIALIZABLE   |    なし    |        なし         |     なし     |

※ InnnoDB では、REPEATABLE READd でも Phantom Read 起こらない。[参考](https://qiita.com/Sekky0905/items/f032a382afbc9d34252f)

- Dirty Read

  - 未コミットのトランザクションの更新を別トランザクションが読み取る現象。
  - トランザクション T1 がデータを変更し、COMMIT か ROLLBACK をする前に、トランザクション T2 がそのデータを読む。その後 T1 が ROLLBACK した場合、T2 は COMMIT されていない＝実在しないデータを読んだことになる。

- Non-repeatable Read

  - トランザクション内で一度読み取ったデータを再度読み取る時に、コミット済みの別トランザクション(更新 or 削除)によって結果が変わる現象。
  - トランザクション T1 がデータを読んだ後、トランザクション T2 がそのデータを変更もしくは削除して COMMIT する。その後 T1 がデータを再度読もうとすると、データが変更されている、もしくは削除されていることが検知される。

- Phantom Read

  - トランザクション内で一度読み取ったデータを再度読み取る時に、コミット済みの別トランザクション(挿入)によって結果が変わる現象。
  - トランザクション T1 が、ある検索条件に基づいてデータ集合を読む。その後、トランザクション T2 がその検索条件を満たすデータを作成し COMMIT する。T1 が再度同じ検索条件で読み取りを行うと、最初に得られたデータ集合と異なるデータ集合が得られる。

参考：
https://zenn.dev/tockn/articles/4268398c8ec9a9  
https://blog.amedama.jp/entry/mysql-innodb-tx-iso-levels  
https://github.com/ichirin2501/doc/blob/master/innodb.md  
https://zatoima.github.io/oracle-mysql-postgresql-isolation-level.html

### 行レベルのロック、テーブルレベルのロックの違い

**テーブルロック**

- テーブル全体をロックし、他のセッションからの読み取り、または書き込みから保護する。
  - READ ロック
    - テーブルを読み取ることが出来る。(書き込みは出来ない)
    - 他のセッションが同時にテーブルに対する READ ロックを取得することが出来る。(占有ロックと同じかな？)
  - WRITE ロック
    - テーブルの読み書きが出来る。
    - ロックを保持しているセッションだけがテーブルにアクセス出来る。(排他ロックと同じかな？)
      - 排他ロック(X-Lock)では分離レベルによって設定されている、一貫性読み取りはなさそう？
  - READ と WRITE が実行された時、WRITE が優先的に実行される。

参考：
https://dev.mysql.com/doc/refman/5.6/ja/lock-tables.html

**行ロック**

- テーブルのレコード(行)をそれぞれロックし、他のセッションからの読み取り、または書き込みから保護する。
- MySQL の InnoDB はデフォルトで行レベルロックを使用している。
- 行レベルのロックには二つのモードがあります。
  - 共有ロック(S-Lock)
    - トランザクションによる行の読み取りが許可される。
    - 他の共有ロックのリクエストも許可するが、書き込むことは許可されない。
  - 排他ロック(X-Lock)
    - 他のトランザクションが同じ行をロックするのを回避するタイプのロック。トランザクションの分離レベルに応じて、他のトランザクションが同じ行を書き込むのをブロックしたり、他のトランザクションが同じ行を読み取るのをブロックしたり出来る。
    - InnoDB のデフォルト分離レベル`REPEATABLE READ`では、排他ロックを持つ行をトランザクションが読み取ることを許可する(一貫性読み取り)ことによって、より高い並列性を実現している。
- テーブルロックに比べた利点
  - 異なるセッションが異なる行にアクセスする場合、ロックの競合は少なくなります。
  - ロールバックする変更が少なくなる。
  - 一つの行を長時間ロック出来る。

参考:
https://dev.mysql.com/doc/refman/5.6/ja/glossary.html#glos_exclusive_lock  
https://dev.mysql.com/doc/refman/5.6/ja/internal-locking.html

### 悲観ロックと楽観ロックの違い

**楽観ロック**

- データそのものに対してロックは行わずに、更新対象のデータが、データ取得時と同じ状態であることを確認してから更新することで、データの整合性を保証する手法である。
- 楽観ロックを使用する場合は、更新対象のデータが、データ取得時と同じ状態であることを判断するために、Version を管理するためのカラム(Version カラム)を用意する。
- 更新時の条件として、データ取得時の Version と、データ更新時の Version を同じとすることで、データの整合性を保証することができる。

**悲観ロック**

- 悲観ロックとは、更新対象のデータを取得する際にロックをかけることで、他のトランザクションから更新されないようにする手法である。
- 悲観ロックを使用する場合は、トランザクション開始直後に更新対象となるレコードのロックを取得する。
- ロックされたレコードは、トランザクションが、コミットまたはロールバックされるまで、他のトランザクションから更新されないため、データの整合性を保証することができる。

参考：
https://terasolunaorg.github.io/guideline/1.0.4.RELEASE/ja/ArchitectureInDetail/ExclusionControl.html

### メモ

- 最後のデッドロックを確認する方法

```sql
SHOW ENGINE INNODB STATUS;
```

- デッドロックが起きた場合、片方のトランザクションをロールバックして、もう片方のトランザクションの処理を進めると書いてある。[参考](https://mita2db.hateblo.jp/entry/mysql-deadlock)がドキュメントに明示的に記載されていたりするのか？

- トランザクションの分離レベルで生じる問題が実際の実務で起きた事例などあれば知りたい。

- MySQL と Postgresql でトランザクション周りの違い？注意すべきことはどのようなことがある？

## 課題２（実装）

この課題でも「従業員データ」を使います
トランザクションを実演するためには複数のクライアントから同時に接続する必要があります。MySQL に複数のターミナルから接続して、同時に複数のリクエストを実行できるようにしてください（mysql -uroot -pcollege を複数のターミナルから実行すれば OK です）

- 分けて見やすくするために、それぞれのプロンプトの表示を分けました。

```sql
mysql> PROMPT mysql1>

mysql> PROMPT mysql2>
```

- emp_no`10001`のデータを使う。

```sql
mysql1> SELECT * FROM employees limit 1;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

**Dirty Read**

- トランザクションの分離レベルを`READ UNCOMMITTED`に変更する。今回はテストなので、global ではなく、session 変数を変更した。

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
mysql> SELECT @@global.transaction_isolation, @@session.transaction_isolation;
+--------------------------------+---------------------------------+
| @@global.transaction_isolation | @@session.transaction_isolation |
+--------------------------------+---------------------------------+
| REPEATABLE-READ                | READ-UNCOMMITTED                |
+--------------------------------+---------------------------------+
```

- それぞれトランザクションを貼る

```sql
mysql1> START TRANSACTION;

mysql2> START TRANSACTION;
```

- mysql1 にて、以下の update 文を実行する。(last_name の変更)

```sql
mysql1> UPDATE employees SET last_name = 'Tsubasa' WHERE emp_no = 10001;
```

- mysql2 にて、emp_no`10001`のデータを見ると、コミット前であるが、更新されたデータが取得出来てしまっている。これが**Dirty Read**

```sql
mysql2>SELECT * FROM employees WHERE emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Tsubasa   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

- ROLLBACK を忘れずに

```sql
mysql1>ROLLBACK;

mysql2>ROLLBACK;
```

**Non-repeatable read**

- トランザクションの分離レベルを`READ COMMITTED`に変更する。

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
mysql> SELECT @@global.transaction_isolation, @@session.transaction_isolation;
+--------------------------------+---------------------------------+
| @@global.transaction_isolation | @@session.transaction_isolation |
+--------------------------------+---------------------------------+
| REPEATABLE-READ                | READ-COMMITTED                  |
+--------------------------------+---------------------------------+
```

- それぞれトランザクションを貼る

```sql
mysql1> START TRANSACTION;

mysql2> START TRANSACTION;
```

- mysql1 にて、以下の update 文を実行する。(last_name の変更)

```sql
mysql1> UPDATE employees SET last_name = 'Tsubasa' WHERE emp_no = 10001;
```

- mysql2 にて、emp_no`10001`のデータを見ると、**Dirty Read**が起こっていないことが分かる。

```sql
mysql2>SELECT * FROM employees WHERE emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

- mysql1 をコミットし、mysql2 で再び emp_no`10001`のデータを確認すると、更新されたデータを取得してしまっており、**Non-repeatable read**が起こっていることが分かる。

```sql
mysql1> COMMIT;
```

```sql
mysql2>SELECT * FROM employees WHERE emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Tsubasa   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
```

- データを忘れずに戻す

```sql
mysql1>UPDATE employees SET last_name = 'Facello' WHERE emp_no = 10001;
```

**Phantom read**

- トランザクションの分離レベルを`READ COMMITTED`に変更する。InnnoDB では`REPEATABLE READ`では Phantom read が起こらないため。

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
mysql> SELECT @@global.transaction_isolation, @@session.transaction_isolation;
+--------------------------------+---------------------------------+
| @@global.transaction_isolation | @@session.transaction_isolation |
+--------------------------------+---------------------------------+
| REPEATABLE-READ                | READ-COMMITTED                  |
+--------------------------------+---------------------------------+
```

- それぞれトランザクションを貼る

```sql
mysql1> START TRANSACTION;

mysql2> START TRANSACTION;
```

- mysql2 にて、employees テーブルのレコード数を取得する。

```sql
mysql2>SELECT COUNT(*) FROM employees;
+----------+
| COUNT(*) |
+----------+
|   300024 |
+----------+
```

- mysql1 にて、以下の delete 文を実行し、COMMIT する。

```sql
mysql1> DELETE FROM employees WHERE emp_no = 10001;

mysql1> COMMIT;
```

- mysql2 にて、COUNT 数を確認すると数値が減っており、**Phantom read**が起こっていることが分かる。

```sql
mysql2>SELECT COUNT(*) FROM employees;
+----------+
| COUNT(*) |
+----------+
|   300023 |
+----------+
```

参考：
https://blog.amedama.jp/entry/mysql-innodb-tx-iso-levels

## 課題３（クイズ）

No.1

MySQL の InnoDB にて、設定できるトランザクションの分離レベルである`SERIALIZABLE`・`READ COMMITTED`・`READ UNCOMMITTED`・`REPEATABLE READ` を分離レベルが高い順(より厳密にトランザクションを分離出来る)に並び替えてください。

<details><summary>回答</summary>

1. SERIALIZABLE
2. REPEATABLE READ
3. READ COMMITTED
4. READ UNCOMMITTED

参考：
https://dev.mysql.com/doc/refman/5.6/ja/set-transaction.html

</details>

No.2

トランザクションの特性である ACID 特性の I について、今回の課題で学びましたが、残りの ACD はどのような意味なのか説明してください。

<details><summary>回答</summary>

**A(Atomicity)**

- タスクが全て実行されるか、あるいは全く実行されないことを保証する性質

**C(Consistency)**

- 整合性を満たすことを保証する性質

**D(Durability)**

- 完了通知をユーザが受けた時点でその操作は永続的となり結果が失われないこと。たとえシステム障害が発生してもデータが失われることがない性質。

参考：
https://github.com/ichirin2501/doc/blob/master/innodb.md#%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E5%88%86%E9%9B%A2%E3%83%AC%E3%83%99%E3%83%AB

</details>

No.3

MySQL の InnoDB の行レベルロックには、レコードロックという仕組みがありますが、インデックスが貼られていないカラムに対して、この仕組みを利用した場合、どのような挙動になるでしょうか？

<details><summary>回答</summary>

- テーブルロックが起こる。レコードロックはインデックスレコードに対するロックのため、インデックスが貼られていないとテーブルごとロックしてしまう。

- employees テーブルで試してみる。

```sql
mysql1> SHOW INDEX FROM employees;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY  |            1 | emp_no      | A         |      299068 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+

--- テストデータ
mysql> INSERT INTO employees VALUES (1000000, '1963-05-14', 'Nakano', 'Tsubasa', 'M', '1993-07-02');
```

- last_name `Tsubasa`のデータに対してロックを掛ける。

```sql
mysql1> START TRANSACTION;

mysql1> SELECT * FROM employees WHERE last_name = 'Tsubasa' FOR UPDATE;
+---------+------------+------------+-----------+--------+------------+
| emp_no  | birth_date | first_name | last_name | gender | hire_date  |
+---------+------------+------------+-----------+--------+------------+
| 1000000 | 1963-05-14 | Nakano     | Tsubasa   | M      | 1993-07-02 |
+---------+------------+------------+-----------+--------+------------+
```

- 新しいデータを Insert しようとすると、テーブル全体にロックが掛かっているため、デッドロックが起きてしまう。

```sql
mysql> INSERT INTO employees VALUES (1000002, '1963-05-14', 'Tanaka', 'Taro', 'M', '1993-07-02');
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

参考：
https://github.com/ichirin2501/doc/blob/master/innodb.md#%E9%9D%9Eindex%E3%81%AE%E3%81%A8%E3%81%8D  
https://dev.mysql.com/doc/refman/5.6/ja/innodb-record-level-locks.html  
https://qiita.com/hmatsu47/items/f5eb64428494686d4ad3

</details>
