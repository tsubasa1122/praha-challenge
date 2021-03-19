課題のリンクは[こちら](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recaoPX7kBTbdWJfo)です。

## 課題１（質問）

### インデックスの仕組みを説明してください

インデックスとは、どの行がどの場所にあるかを保持したデータで、書籍の索引のようなものです。

例えば、「データベース」という単語を国語辞典で引くときに、1 ページ目から順に「データベース」という単語を調べると、全ての単語を確認しなくてはならなくなるため、とても時間が掛かってしまいます。そんな時に索引があることで、「て」の索引から引かれたページから「データベース」という単語を調べることが出来るようになるため、より早く目的の単語を見つけることが出来るようになります。この索引の役割をするのが、リレーショナルデータベースにおける「インデックス」です。

### slow query log を調べる理由

クエリが遅くなっている原因を調べるためです。

インデックスを貼ると、データベースの中でテーブルを参照する新しいデータ構造が作られるようになります。[参考](https://use-the-index-luke.com/ja/sql/anatomy)
そのため、むやみやたらにインデックスを貼ってしまうと、その分無駄にデータを保持してしまうことになります。
また、テーブルにデータが追加されるたびにインデックスで保持しているデータも更新する必要がある(辞書の索引に項目を追加するイメージ)ので、テーブルへの Insert や Update が遅くなってしまいます。

slow query log を出力することで、遅いクエリが指定されたファイルにログとして出力されるようになるため、そのクエリをピックアップして EXPLAIN などを使いながらインデックスが適切に使用されているかを確認し、クエリの修正もしくはカラムへのインデックスの追加を行うべきです。

参考：
https://qiita.com/katsukii/items/3409e3c3c96580d37c2b
http://naoberry.com/tech/slowquery/
https://www.dbonline.jp/sqlite/index/index1.html

### カーディナリティとは何でしょうか？

レコード数に対するカラムの値の種類の多さのことを差します。
例えば、東京都民をレコードとするテーブルを考えます。
性別というカラムは male、female の 2 種類程度であるのでカーディナリティが低いです。
一方、マイナンバーというカラムは被りがないので非常にカーディナリティが高いです。

インデックスはカーディナリティが高いものを設定するとより効果的です。
逆に、カーディナリティが低いものにインデックスを設定しても絞り込める範囲が広いため、あまり効果がありません。
検索対象のデータが全体の 10%未満くらいを指標にすると良いらしい(書籍: 失敗から学ぶ RDB の正しい歩き方より)

参考：
https://roy29fuku.com/infra/sql/mysql-summary-of-index/

### カバリングインデックスを説明してみてください。

クエリが必要とするカラムが全てインデックスに含まれている場合、インデックスを読み込むだけで良くなるため、とてもレスポンスが早くなります。インデックスがクエリ全体をカバーしていることから、カバリングインデックスと呼ばれます。

(例) id がプライマリーキーで a カラムにインデックスを貼った場合

```
SELECT id FROM t WHERE a = ?;
```

上記のクエリを実行すると、インデックスに保存されているデータを参照して、一致するデータを返すだけになるので、非常に早いレスポンスを実現出来る。
id はプライマリーキーなので、[セカンダリインデックス](http://nippondanji.blogspot.com/2010/10/innodb.html)のリーフノードに含まれる。
通常のインデックス利用の場合、インデックスに保存されているデータを参照して、一致するデータを見つけたら、そのポインターを辿って実データを取り出す必要があるため、カバリングインデックスよりも若干遅くなる。

参考：
https://blog.kyanny.me/entry/20100920/1284992435
https://yakst.com/ja/posts/2462
http://nippondanji.blogspot.com/2010/10/innodb.html
https://abicky.net/2018/03/25/141353/
https://use-the-index-luke.com/ja/sql/clustering/index-only-scan-covering-index
https://techlife.cookpad.com/entry/2017/04/18/092524
http://blog.livedoor.jp/sasata299/archives/51336006.html

## 課題２（実装）

計測結果は performance_schema.events_statements_summary_by_digest の値を参照しました。

1.

```sql
SELECT * FROM salaries WHERE salary = 60117;
```

実行結果(インデックス無し) 4.28s 程度、実行時間が掛かっている。

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 3944eb3fb1c5f3296540586624351c3e
cnt: 1
min: 4.278633614
max: 4.278633614
db: employees
query: SELECT \* FROM `salaries` WHERE `salary` = ?

---
```

salaries テーブルの salary カラムにインデックスを追加した。

```sql
CREATE INDEX salary_index ON salaries(salary);
SHOW CREATE TABLE salaries;

| salaries | CREATE TABLE `salaries` (
  `emp_no` int(11) NOT NULL,
  `salary` int(11) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  PRIMARY KEY (`emp_no`,`from_date`),
  KEY `salary_index` (`salary`),
  CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`emp_no`) REFERENCES `employees` (`emp_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

実行結果(インデックス追加後) 0.0007s に改善されている。(min の値を参照)

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 3944eb3fb1c5f3296540586624351c3e
cnt: 4
min: 0.000723589
max: 4.278633614
db: employees
query: SELECT \* FROM `salaries` WHERE `salary` = ?

---
```

EXPLAIN の結果

- possible_keys
  インデックスが使われていればインデックスの key 名が表示され、使われなければ null が表示されます。

- rows
  1 回の SQL でのデータの読み込み量を表します。この値が少ないほど、データを読み込む必要がなくなるため、高速になります。

```sql
-- インデックス追加前
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+
| id | select_type | table    | partitions | type | possible_keys | key  | key_len | ref  | rows    | filtered | Extra       |
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+
|  1 | SIMPLE      | salaries | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 2059937 |    10.00 | Using where |
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+

-- インデックス追加後
+----+-------------+----------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
| id | select_type | table    | partitions | type | possible_keys | key          | key_len | ref   | rows | filtered | Extra |
+----+-------------+----------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | salaries | NULL       | ref  | salary_index  | salary_index | 4       | const |   65 |   100.00 | NULL  |
+----+-------------+----------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
```

2.

```sql
SELECT * FROM employees WHERE first_name = 'Georgi';
```

実行結果(インデックス無し) 0.093s 程度、実行時間が掛かっている。

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 26162640da56da09595a7e10ac8ecb47
cnt: 1
min: 0.093808088
max: 0.093808088
db: employees
query: SELECT \* FROM `employees` WHERE `first_name` = ?

---
```

employees テーブルの first_name カラムにインデックスを追加した。

```sql
CREATE INDEX first_name_index ON employees(first_name);
SHOW CREATE TABLE employees;

| employees | CREATE TABLE `employees` (
  `emp_no` int(11) NOT NULL,
  `birth_date` date NOT NULL,
  `first_name` varchar(14) NOT NULL,
  `last_name` varchar(16) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`emp_no`),
  KEY `first_name_index` (`first_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

実行結果(インデックス追加後) 0.0023s に改善されている。(min の値を参照)

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 26162640da56da09595a7e10ac8ecb47
cnt: 4
min: 0.002399475
max: 0.093808088
db: employees
query: SELECT \* FROM `employees` WHERE `first_name` = ?

---
```

EXPLAIN の結果

```sql
-- インデックス追加前
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+


-- インデックス追加後
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys    | key              | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | first_name_index | first_name_index | 16      | const |  253 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
```

3.

```sql
SELECT * FROM employees WHERE birth_date = '1960-04-17';
```

実行結果(インデックス無し) 0.096s 程度、実行時間が掛かっている。

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: e9575fb23e3c50af78e0f5e0f5408a1f
cnt: 1
min: 0.096900258
max: 0.096900258
db: employees
query: SELECT \* FROM `employees` WHERE `birth_date` = ?

---
```

employees テーブルの birth_date カラムにインデックスを追加した。

```sql
CREATE INDEX birth_date_index ON employees(birth_date);
SHOW CREATE TABLE employees;

| employees | CREATE TABLE `employees` (
  `emp_no` int(11) NOT NULL,
  `birth_date` date NOT NULL,
  `first_name` varchar(14) NOT NULL,
  `last_name` varchar(16) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`emp_no`),
  KEY `first_name_index` (`first_name`),
  KEY `birth_date_index` (`birth_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

実行結果(インデックス追加後) 0.0005s に改善されている。(min の値を参照) ※date 型を文字列一致で使っているが、インデックスが効いていそう。

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: e9575fb23e3c50af78e0f5e0f5408a1f
cnt: 3
min: 0.000530615
max: 0.096900258
db: employees
query: SELECT \* FROM `employees` WHERE `birth_date` = ?

---
```

EXPLAIN の結果

```sql
-- インデックス追加前
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+

-- インデックス追加後
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys    | key              | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | birth_date_index | birth_date_index | 3       | const |   66 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+-------+
```

### メモ

- インデックスの key 名には、命名規則などはあるのだろうか？
- クラスタインデックスに Incremental な id を指定した場合、レコードは id 順に保持された状態で格納される。
  - id 順にデータを取り出したい場合、ORDER BY を指定しなくても良さそうだが、MySQL の仕様上、ORDER BY を指定しない時は順番が保証されないらしいので注意が必要。
    https://stackoverflow.com/questions/1949641/what-is-mysql-row-order-for-select-from-table-name

## 課題３（実装）

以下のクエリを実行し、レコードの追加・削除を行いました。

```sql
-- salariesテーブルにレコードの追加
INSERT INTO salaries value(10002, 601179, '1986-06-26', '1987-06-26');

-- salariesテーブルにレコードの削除
DELETE FROM salaries WHERE salary = 601179;
```

### インデックスがある状態のデータ追加・削除

以下の実行結果から、データの登録に 0.046s 程掛かっていることが分かる。

```
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: a6c8760138744a777c59a39d44dad0cd
cnt: 1
min: 0.046064527
max: 0.046064527
db: employees
query: INSERT INTO `salaries` VALUE (...)

---
```

以下の実行結果から、データの削除に 0.005s 程掛かっていることが分かる。

```
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 82da83cc09b7747c3fd18c506406c5ee
cnt: 1
min: 0.004934206
max: 0.004934206
db: employees
query: DELETE FROM `salaries` WHERE `salary` = ?

---
```

### インデックスを削除した状態のデータ追加・削除

インデックスを削除する。(課題 2 で追加した salary_index を削除する。)

```sql
DROP INDEX salary_index ON salaries;
SHOW CREATE TABLE salaries;

| salaries | CREATE TABLE `salaries` (
  `emp_no` int(11) NOT NULL,
  `salary` int(11) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  PRIMARY KEY (`emp_no`,`from_date`),
  CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`emp_no`) REFERENCES `employees` (`emp_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

以下の実行結果から、データの登録に 0.008s 程掛かっていることが分かる。(min の値を参照)インデックス削除前に比べて、データを登録する速度が早くなっている。

```
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: a6c8760138744a777c59a39d44dad0cd
cnt: 2
min: 0.00845552
max: 0.046064527
db: employees
query: INSERT INTO `salaries` VALUE (...)

---
```

以下の実行結果から、データの削除に 2.158s 程掛かっていることが分かる。(max の値を参照)インデックス削除前に比べて、データを削除する速度が遅くなっている。

```text
\***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\*** 1. row \***\*\*\*\*\*\*\***\*\*\*\***\*\*\*\*\*\*\***
DIGEST: 82da83cc09b7747c3fd18c506406c5ee
cnt: 2
min: 0.004934206
max: 2.157634693
db: employees
query: DELETE FROM `salaries` WHERE `salary` = ?

---
```

### インデックス削除後、データの登録が早くなり、データの削除が遅くなった理由

- インデックスが存在する場合、データの登録・削除時にはインデックスが保持しているデータにも処理を追加する必要があるため、理論上はインデックスがない時に比べて処理が遅くなります。しかし、今回のようにデータ削除時のクエリに WHERE 句を使用していた場合、削除するデータを探索する際にインデックスが効くことがあるため、インデックスがある方が処理速度が早くなる場合があります。[参考](https://use-the-index-luke.com/ja/sql/dml/delete)

課題３（クイズ）

No.1

employees テーブルを用いて、1990 年の 4 月に雇用された従業員一覧を取得してください。

<details><summary>回答</summary>

実行するクエリの例(2206 rows のレコードが取得されます。)

```sql
SELECT * FROM employees WHERE hire_date BETWEEN DATE('1990-04-01') AND DATE('1990-04-30');
```

実行速度の結果

```text
*************************** 1. row ***************************
DIGEST: f05b1804f6185b4a3c76d8244d4f97b2
cnt: 1
min: 0.090940735
max: 0.090940735
db: employees
query: EXPLAIN SELECT * FROM `employees` WHERE `hire_date` BETWEEN DATE (?) AND DATE (?)

---
```

インデックスを貼る前の EXPLAIN

```sql
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |    11.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

インデックスを貼る

```sql
CREATE INDEX hire_date_index ON employees(hire_date);

SHOW CREATE TABLE employees;
| employees | CREATE TABLE `employees` (
  `emp_no` int(11) NOT NULL,
  `birth_date` date NOT NULL,
  `first_name` varchar(14) NOT NULL,
  `last_name` varchar(16) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`emp_no`),
  KEY `hire_date_index` (`hire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

インデックスを貼った後の実行結果 0.011s(min の値を参照)と出ており、実行速度が早くなっていることが分かる。

```text
*************************** 1. row ***************************
DIGEST: f05b1804f6185b4a3c76d8244d4f97b2
cnt: 2
min: 0.010776302
max: 0.090940735
db: employees
query: EXPLAIN SELECT * FROM `employees` WHERE `hire_date` BETWEEN DATE (?) AND DATE (?)

---
```

インデックスを貼った後の EXPLAIN。possible_keys を見るとインデックスが使われていることが分かる。

```sql
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys   | key             | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | hire_date_index | hire_date_index | 3       | NULL | 2206 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+-----------------------+
```

</details>

No.2

employees テーブルを用いて、1965 年の 2 月 1 日生まれの従業員を last_name がアルファベット順に並び替えてください。

<details><summary>回答</summary>

実行するクエリの例(49 rows のレコードが取得されます。)

```sql
-- STR_TO_DATEの[参考](https://dev.mysql.com/doc/refman/5.6/ja/date-and-time-functions.html#function_str-to-date)
SELECT * FROM employees WHERE birth_date = STR_TO_DATE('1965-02-01', '%Y-%m-%d') ORDER BY last_name ASC;

-- これでも書けます
SELECT * FROM employees WHERE birth_date = '1965-02-01' ORDER BY last_name ASC;

-- アンチパターン カラムに変換処理が入るため、インデックスが効かなくなる。[参考](https://use-the-index-luke.com/ja/sql/where-clause/obfuscation/dates)
SELECT * FROM employees WHERE DATE_FORMAT(birth_date, '%Y-%m-%d') = '1965-02-01' ORDER BY last_name ASC;

```

実行結果の上位 10 件

```sql
+--------+------------+----------------+-----------------+--------+------------+
| emp_no | birth_date | first_name     | last_name       | gender | hire_date  |
+--------+------------+----------------+-----------------+--------+------------+
| 214866 | 1965-02-01 | Gopalakrishnan | Angel           | F      | 1985-09-19 |
| 235729 | 1965-02-01 | Henk           | Anger           | M      | 1993-01-19 |
| 266206 | 1965-02-01 | Zsolt          | Anily           | F      | 1985-08-19 |
| 109598 | 1965-02-01 | Stamatina      | Auyong          | M      | 1988-07-05 |
|  60091 | 1965-02-01 | Surveyors      | Bade            | F      | 1988-05-01 |
| 437369 | 1965-02-01 | Kazuhide       | Biran           | F      | 1995-01-25 |
| 272860 | 1965-02-01 | Minghong       | Candan          | F      | 1994-02-10 |
|  11157 | 1965-02-01 | Mario          | Cochrane        | M      | 1985-03-30 |
|  93549 | 1965-02-01 | Arie           | Coullard        | F      | 1986-11-01 |
| 418860 | 1965-02-01 | Ymte           | Dalton          | F      | 1992-11-22 |
| 287323 | 1965-02-01 | Steve          | Dengi           | M      | 1987-10-07 |
+--------+------------+----------------+-----------------+--------+------------+
```

実行速度の結果

```text
*************************** 1. row ***************************
DIGEST: 16d07f891e3ddf526af039ef95e52604
cnt: 1
min: 0.106236017
max: 0.106236017
db: employees
query: SELECT * FROM `employees` WHERE `birth_date` = `STR_TO_DATE` (...) ORDER BY `last_name` ASC

---
```

インデックスを貼る前の EXPLAIN

```sql
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |    10.00 | Using where; Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
```

インデックスを貼る

```sql
CREATE INDEX birth_date_index ON employees(birth_date);

SHOW CREATE TABLE employees;
| employees | CREATE TABLE `employees` (
  `emp_no` int(11) NOT NULL,
  `birth_date` date NOT NULL,
  `first_name` varchar(14) NOT NULL,
  `last_name` varchar(16) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`emp_no`),
  KEY `birth_date_index` (`birth_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

インデックスを貼った後の実行結果 0.0008s(min の値を参照)と出ており、実行速度が早くなっていることが分かる。

```text
*************************** 1. row ***************************
DIGEST: 16d07f891e3ddf526af039ef95e52604
cnt: 2
min: 0.000803721
max: 0.090940735
db: employees
query: EXPLAIN SELECT * FROM `employees` WHERE `hire_date` BETWEEN DATE (?) AND DATE (?)

---
```

インデックスを貼った後の EXPLAIN。possible_keys を見ると、インデックスが使われていることが分かる。

```sql
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+---------------------------------------+
| id | select_type | table     | partitions | type | possible_keys    | key              | key_len | ref   | rows | filtered | Extra                                 |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+---------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ref  | birth_date_index | birth_date_index | 3       | const |   49 |   100.00 | Using index condition; Using filesort |
+----+-------------+-----------+------------+------+------------------+------------------+---------+-------+------+----------+---------------------------------------+
```

</details>

No.3

employees テーブルを用いて、従業員の last_name の頭文字が 'Mor' で始まる従業員を男女別に emp_no 順で表示してください。(男性 F を先に表示してください)

<details><summary>回答</summary>

実行するクエリの例(948 rows のレコードが取得されます。)

```sql
SELECT * FROM employees WHERE last_name LIKE 'Mor%' ORDER BY gender DESC, emp_no;

```

実行結果の上位 10 件

```sql
+--------+------------+----------------+-----------+--------+------------+
| emp_no | birth_date | first_name     | last_name | gender | hire_date  |
+--------+------------+----------------+-----------+--------+------------+
|  12018 | 1956-12-23 | Fai            | Morton    | F      | 1990-07-23 |
|  12656 | 1955-08-12 | Seshu          | Morton    | F      | 1994-06-27 |
|  15588 | 1963-10-13 | Gererd         | Morrow    | F      | 1993-10-07 |
|  15730 | 1961-02-21 | Karlis         | Morton    | F      | 1991-07-14 |
|  16739 | 1958-09-22 | Insup          | Morris    | F      | 1985-05-09 |
|  18403 | 1952-07-05 | Vidya          | Morrow    | F      | 1985-11-18 |
|  18466 | 1963-04-06 | Emdad          | Morton    | F      | 1989-11-18 |
|  19236 | 1965-01-24 | Elzbieta       | Morris    | F      | 1988-01-07 |
|  20102 | 1961-05-01 | Sarita         | Morton    | F      | 1991-05-14 |
|  20488 | 1962-08-09 | Bokyung        | Morrey    | F      | 1987-11-29 |
+--------+------------+----------------+-----------------+--------+-------
```

実行速度の結果

```text
*************************** 1. row ***************************
DIGEST: c2322fb9edd04cdb012e7cdc1b0ee394
cnt: 1
min: 0.085298788
max: 0.085298788
db: employees
query: SELECT * FROM `employees` WHERE `last_name` LIKE ? ORDER BY `gender` DESC , `emp_no`

---
```

インデックスを貼る前の EXPLAIN

```sql
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |    11.11 | Using where; Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-----------------------------+
```

インデックスを貼る

```sql
CREATE INDEX last_name_index ON employees(last_name);

SHOW CREATE TABLE employees;
| employees | CREATE TABLE `employees` (
  `emp_no` int(11) NOT NULL,
  `birth_date` date NOT NULL,
  `first_name` varchar(14) NOT NULL,
  `last_name` varchar(16) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `hire_date` date NOT NULL,
  PRIMARY KEY (`emp_no`),
  KEY `last_name_index` (`last_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

インデックスを貼った後の実行結果 0.007s(min の値を参照)と出ており、実行速度が早くなっていることが分かる。

```text
*************************** 1. row ***************************
DIGEST: c2322fb9edd04cdb012e7cdc1b0ee394
cnt: 2
min: 0.006843934
max: 0.085298788
db: employees
query: SELECT * FROM `employees` WHERE `last_name` LIKE ? ORDER BY `gender` DESC , `emp_no`

---
```

インデックスを貼った後の EXPLAIN。possible_keys を見ると、インデックスが使われていることが分かる。

```sql
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+---------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys   | key             | key_len | ref  | rows | filtered | Extra                                 |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+---------------------------------------+
|  1 | SIMPLE      | employees | NULL       | range | last_name_index | last_name_index | 18      | NULL |  948 |   100.00 | Using index condition; Using filesort |
+----+-------------+-----------+------------+-------+-----------------+-----------------+---------+------+------+----------+---------------------------------------+
```

</details>
