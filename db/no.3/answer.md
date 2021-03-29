## 課題１（質問）

### 複合インデックスの仕組み

- 複数の列から構成されるインデックスです。単一インデックスに比べて、より詳細な検索を高速化することが出来るようになります。

  Employ データベースの employess テーブルを例に出して考えてみます。

```sql
mysql> describe employees.employees;
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int(11)       | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   | MUL | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   | MUL | NULL    |       |
+------------+---------------+------+-----+---------+-------+
```

誕生日(birth_date)が「1964 年 1 月 1 日」の姓(last_name)が「B」で始まる従業員のデータを取得したい時に以下のクエリを実行するとします。

```sql
SELECT
  *
FROM
  employees
WHERE birth_date = DATE('1964-01-01')
AND last_name LIKE 'B%';
```

**インデックスが無い場合**

- レコード全件から指定した birth_date のデータを絞り込み、更にその絞り込んだデータの中から last_name で絞り込む処理が入ります。
- birth_date も last_name も順番がバラバラのデータから探す必要があるため、目的のデータを探すのに時間が掛かる。

**birth_date だけインデックスを貼った場合**

- birth_date でソートされた状態のインデックスデータを辿り、指定のデータを取得して、last_name で絞り込む処理が入ります。
- birth_date はソートされているので、目的のデータは見つけやすい。last_name はバラバラでデータが保存されているので、目的のデータを探すのに時間が掛かる。

**birth_date,last_name でインデックスを貼った場合**

- birth_date でソートされた状態のインデックスデータを辿り、更に last_name でソートされた状態のインデックスデータを辿って絞り込みます。
- birth_date -> last_name 順でソートされた状態のデータが保持されているので、目的のデータを探しやすい。(※次の課題で説明しますが、last_name 単体ではソートされていないため、必ず birth_date で先に絞り込む必要があります。)

上記の三つの状態を比較したとき、今回のクエリの実行速度が早い順番に並べると、以下のようになります。

```
birth_date,last_name のインデックス(複合インデックス) > birth_date だけインデックス(単一インデックス) > インデックス無し
```

### メモ

- employees(birth_date, last_name)のインデックスを貼って、ある誕生日のデータを全件取得したら、last_name のソート順でデータが取得されるのだろうか？

  - 手元で試した感じは last_name のソート順でデータが取得出来ていそう。
  - インデックスに指定した一番目のカラムのデータに紐づく二番目のカラムのデータがソートされているだけなので、注意。
  - インデックスを貼った複数カラムで ORDER BY を行う場合、ASC・DESC が異なるとき、複合インデックスは効かない。
  - 一番目のカラムでの絞り込みの結果が複数あるとき、複合インデックスを有効に活用出来ないため、単一インデックスを優先してしまう。ORDER BY で複数カラムを指定していたら複合インデックスを使用していそう。
  - 木構造難しい..

  参考：
  http://nippondanji.blogspot.com/2008/12/2008.html  
  https://techlife.cookpad.com/entry/2017/04/18/092524#f-765eb098

### フルテーブルスキャンになる理由と修正案

**原因**
インデックス定義の順番が正しくないためです。
今回の例だと、first_name を先にインデックスに定義しているため、必ず実行するクエリは first_name を含めて、先に実行しなくてはいけません。
複合インデックスでは、定義したカラムの順番と実際に実行するクエリの順番を注意しないと上手くインデックスを活用出来ません。

**修正案**
first_name, last_name のインデックスの順番を逆にします。具体的には以下のようなインデックスを作成します。

```sql
CREATE INDEX employees_name ON employees (last_name, first_name)
```

参考：
https://dev.mysql.com/doc/refman/5.6/ja/multiple-column-indexes.html

## 課題２（実装）

今回は、performance_schema.events_statements_history_long を使って、パフォーマンスの測定を行いました。

```sql
SELECT EVENT_ID, truncate(timer_wait/1000000000000, 6) as duration , SQL_TEXT FROM performance_schema.events_statements_history_long;
```

### クエリ 1

- 誕生日が「1964 年」の姓が「B」で始まる従業員一覧

実行したクエリ

```sql
SELECT
  *
FROM
  employees
WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31')
AND last_name LIKE 'B%';
```

インデックスを貼る前の実行速度(およそ 0.08s)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|      180 | 0.080967 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      196 | 0.077057 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      212 | 0.078562 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      228 | 0.082494 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      244 | 0.082045 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の結果

```sql
mysql> EXPLAIN SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |     1.23 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

birth_date, last_name の複合インデックスを貼る

```sql
mysql> CREATE INDEX idx_birth_date_last_name ON employees(birth_date, last_name);

mysql> SHOW INDEX FROM employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299069 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_birth_date_last_name |            1 | birth_date  | A         |        4717 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_birth_date_last_name |            2 | last_name   | A         |      293662 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の実行速度(およそ 0.02s。実行速度が早くなっている。)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|      382 | 0.020232 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      398 | 0.011530 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      414 | 0.012219 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      430 | 0.011667 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
|      446 | 0.025102 | SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%'                   |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の実行結果。複合インデックスが使われていることが分かる。rows は範囲検索なので、少し多め。

```sql
mysql> EXPLAIN SELECT * FROM employees WHERE birth_date BETWEEN DATE('1964-01-01') AND DATE('1964-12-31') AND last_name LIKE 'B%';
+----+-------------+-----------+------------+-------+--------------------------+--------------------------+---------+------+-------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys            | key                      | key_len | ref  | rows  | filtered | Extra                 |
+----+-------------+-----------+------------+-------+--------------------------+--------------------------+---------+------+-------+----------+-----------------------+
|  1 | SIMPLE      | employees | NULL       | range | idx_birth_date_last_name | idx_birth_date_last_name | 21      | NULL | 44328 |    11.11 | Using index condition |
+----+-------------+-----------+------------+-------+--------------------------+--------------------------+---------+------+-------+----------+-----------------------+
```

### クエリ 2

- last_name が「Braunmuhl」、first_name が「Dhritiman」の emp_no, last_name, first_name を取得してください。

実行したクエリ

```sql
SELECT
  emp_no,
  last_name,
  first_name
FROM
  employees
WHERE last_name = "Braunmuhl"
AND first_name = "Dhritiman";
```

インデックスを貼る前の実行速度(およそ 0.068s)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|      625 | 0.066119 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      641 | 0.065792 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      657 | 0.066750 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      673 | 0.071378 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      689 | 0.066115 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の結果

```sql
mysql> EXPLAIN SELECT EVENT_ID, truncate(timer_wait/1000000000000, 6) as duration , SQL_TEXT FROM performance_schema.events_statements_history_long;
+----+-------------+--------------------------------+------------+------+---------------+------+---------+------+-------+----------+-------+
| id | select_type | table                          | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra |
+----+-------------+--------------------------------+------------+------+---------------+------+---------+------+-------+----------+-------+
|  1 | SIMPLE      | events_statements_history_long | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 10000 |   100.00 | NULL  |
+----+-------------+--------------------------------+------------+------+---------------+------+---------+------+-------+----------+-------+
```

last_name, first_name の複合インデックスを貼る

```sql
mysql> CREATE INDEX idx_last_name_first_name ON employees(last_name, first_name);

mysql> SHOW INDEX FROM employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299069 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_last_name_first_name |            1 | last_name   | A         |        1656 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_last_name_first_name |            2 | first_name  | A         |      278093 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の実行速度(およそ 0.0004s。実行速度がかなり早くなっている。)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|      857 | 0.000683 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      873 | 0.000332 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      889 | 0.000392 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      905 | 0.000576 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
|      921 | 0.000360 | SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman"                       |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の実行結果。複合インデックスが使われていることが分かる。また、Extra が Using index になっているため、カバリングインデックスが使用されていることが分かる。

```sql
mysql> EXPLAIN SELECT emp_no, last_name, first_name from employees WHERE last_name = "Braunmuhl" AND first_name = "Dhritiman";
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys            | key                      | key_len | ref         | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------------+------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ref  | idx_last_name_first_name | idx_last_name_first_name | 34      | const,const |    1 |   100.00 | Using index |
+----+-------------+-----------+------------+------+--------------------------+--------------------------+---------+-------------+------+----------+-------------+
```

### クエリ 3

- 2002 年以降に「Senior Engineer」になった数を取得してください。

実行したクエリ

```sql
SELECT
  COUNT(*)
FROM
  titles
WHERE title = 'Senior Engineer'
AND from_date >= '2002-01-01';
```

インデックスを貼る前の実行速度(およそ 0.1s)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|     1678 | 0.106569 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     1694 | 0.111236 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     1710 | 0.102764 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     1726 | 0.103556 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     1742 | 0.102413 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の結果

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01';
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+--------------------------+
| id | select_type | table  | partitions | type  | possible_keys | key     | key_len | ref  | rows   | filtered | Extra                    |
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+--------------------------+
|  1 | SIMPLE      | titles | NULL       | index | NULL          | PRIMARY | 59      | NULL | 441654 |     3.33 | Using where; Using index |
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+--------------------------+
```

title, from_date の複合インデックスを貼る

```sql
mysql> CREATE INDEX idx_title_from_date ON titles(title, from_date);

mysql> SHOW INDEX FROM titles;
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table  | Non_unique | Key_name            | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| titles |          0 | PRIMARY             |            1 | emp_no      | A         |      299628 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          0 | PRIMARY             |            2 | title       | A         |      441654 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          0 | PRIMARY             |            3 | from_date   | A         |      441654 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          1 | idx_title_from_date |            1 | title       | A         |           6 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          1 | idx_title_from_date |            2 | from_date   | A         |       42801 |     NULL | NULL   |      | BTREE      |         |               |
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の実行速度(およそ 0.003s。実行速度が早くなっている。)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|     2008 | 0.002157 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     2024 | 0.002969 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     2040 | 0.003849 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     2056 | 0.002521 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
|     2072 | 0.002699 | SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01'                                            |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

EXPLAIN の実行結果。複合インデックスが使われていることが分かる。また、Extra が Using index になっているため、カバリングインデックスが使用されていることが分かる。

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM titles WHERE title = 'Senior Engineer' AND from_date >= '2002-01-01';
+----+-------------+--------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
| id | select_type | table  | partitions | type  | possible_keys       | key                 | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+--------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | titles | NULL       | range | idx_title_from_date | idx_title_from_date | 55      | NULL | 3658 |   100.00 | Using where; Using index |
+----+-------------+--------+------------+-------+---------------------+---------------------+---------+------+------+----------+--------------------------+
```

## 課題３（クイズ）

### クイズ 1

**titles テーブルから各職種(title)毎に最新の就任日(from_date)を取得してください。**

<details><summary>回答</summary>

想定されるクエリと実行結果

```sql
SELECT
  title,
  MAX(from_date)
FROM
  titles
GROUP BY title;
```

想定される実行結果(7rows)

```text
+--------------------+----------------+
| title              | MAX(from_date) |
+--------------------+----------------+
| Assistant Engineer | 2000-02-01     |
| Engineer           | 2002-08-01     |
| Manager            | 1996-08-30     |
| Senior Engineer    | 2002-08-01     |
| Senior Staff       | 2002-08-01     |
| Staff              | 2000-02-01     |
| Technique Leader   | 2000-02-01     |
+--------------------+----------------+
```

インデックスを貼る前の実行速度(0.2s)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|     2544 | 0.211006 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2564 | 0.209400 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2584 | 0.207175 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2604 | 0.210390 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2624 | 0.208993 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

インデックスを貼る前の EXPLAIN

```sql
mysql> EXPLAIN SELECT title, MAX(from_date) FROM titles GROUP BY title;
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table  | partitions | type  | possible_keys | key     | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | titles | NULL       | index | PRIMARY       | PRIMARY | 59      | NULL | 441654 |   100.00 | Using index; Using temporary; Using filesort |
+----+-------------+--------+------------+-------+---------------+---------+---------+------+--------+----------+----------------------------------------------+
```

title, from_date にインデックスを貼る

```sql
mysql> CREATE INDEX idx_title_from_date ON titles(title, from_date)

mysql> SHOW INDEX FROM titles;
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table  | Non_unique | Key_name            | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| titles |          0 | PRIMARY             |            1 | emp_no      | A         |      299628 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          0 | PRIMARY             |            2 | title       | A         |      441654 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          0 | PRIMARY             |            3 | from_date   | A         |      441654 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          1 | idx_title_from_date |            1 | title       | A         |           6 |     NULL | NULL   |      | BTREE      |         |               |
| titles |          1 | idx_title_from_date |            2 | from_date   | A         |       34397 |     NULL | NULL   |      | BTREE      |         |               |
+--------+------------+---------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の EXPLAIN。複合インデックスを使用し、[ルースインデックススキャン](http://download.nust.na/pub6/mysql/doc/refman/5.1/ja/loose-index-scan.html)が行われていることが分かる。

```sql
mysql> EXPLAIN SELECT title, MAX(from_date) FROM titles GROUP BY title;
+----+-------------+--------+------------+-------+-----------------------------+---------------------+---------+------+------+----------+--------------------------+
| id | select_type | table  | partitions | type  | possible_keys               | key                 | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+--------+------------+-------+-----------------------------+---------------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | titles | NULL       | range | PRIMARY,idx_title_from_date | idx_title_from_date | 52      | NULL |    7 |   100.00 | Using index for group-by |
+----+-------------+--------+------------+-------+-----------------------------+---------------------+---------+------+------+----------+--------------------------+
```

インデックスを貼った後の実行速度(0.0004s かなり早くなった)

```text
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|     2795 | 0.000351 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2812 | 0.000467 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2829 | 0.000372 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2846 | 0.000505 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
|     2863 | 0.000372 | SELECT title, MAX(from_date) FROM titles GROUP BY title                                                                              |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

</details>

### クイズ 2

**salaries テーブルを使って、2000 年以降(from_date)に給与(salary)が 60117 の salaries 一覧を取得してください。**

<details><summary>回答</summary>

想定されるクエリと実行結果

```sql
SELECT
  *
FROM
  salaries
WHERE salary = '60117'
AND from_date >= '2000-01-01';
```

想定される実行結果(15rows)

```text
+--------+--------+------------+------------+
| emp_no | salary | from_date  | to_date    |
+--------+--------+------------+------------+
|  62198 |  60117 | 2002-04-26 | 9999-01-01 |
|  89123 |  60117 | 2000-12-18 | 2001-12-18 |
| 217513 |  60117 | 2000-06-26 | 2001-06-26 |
| 226650 |  60117 | 2002-07-14 | 9999-01-01 |
| 250154 |  60117 | 2002-01-15 | 9999-01-01 |
| 255646 |  60117 | 2001-01-04 | 2002-01-04 |
| 259303 |  60117 | 2000-02-20 | 2001-02-19 |
| 279922 |  60117 | 2002-06-16 | 9999-01-01 |
| 282088 |  60117 | 2001-06-30 | 2002-06-30 |
| 286559 |  60117 | 2000-10-25 | 2001-10-25 |
| 294824 |  60117 | 2001-01-27 | 2002-01-27 |
| 417052 |  60117 | 2000-12-14 | 2001-12-14 |
| 432368 |  60117 | 2000-05-20 | 2001-05-20 |
| 445380 |  60117 | 2001-01-18 | 2002-01-18 |
| 492199 |  60117 | 2002-07-31 | 9999-01-01 |
+--------+--------+------------+------------+
```

インデックスを貼る前の実行速度(0.2s)

```text
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID  | duration | SQL_TEXT                                                                                                                             |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| 127852769 | 0.511537 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127852785 | 0.530792 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127852801 | 0.528734 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127852817 | 0.526960 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127852833 | 0.522087 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

インデックスを貼る前の EXPLAIN

```sql
mysql> EXPLAIN SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01';
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+
| id | select_type | table    | partitions | type | possible_keys | key  | key_len | ref  | rows    | filtered | Extra       |
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+
|  1 | SIMPLE      | salaries | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 2059937 |     3.33 | Using where |
+----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------------+
```

salary, from_date にインデックスを貼る

```sql
mysql> CREATE INDEX idx_salary_from_date ON salaries(salary, from_date);

mysql> SHOW INDEX FROM salaries;
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table    | Non_unique | Key_name             | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| salaries |          0 | PRIMARY              |            1 | emp_no      | A         |      216800 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          0 | PRIMARY              |            2 | from_date   | A         |     2059937 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          1 | idx_salary_from_date |            1 | salary      | A         |       65263 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          1 | idx_salary_from_date |            2 | from_date   | A         |     2059937 |     NULL | NULL   |      | BTREE      |         |               |
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の EXPLAIN。複合インデックスを使用していることが分かる。

```sql
mysql> EXPLAIN SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01';
+----+-------------+----------+------------+-------+----------------------+----------------------+---------+------+------+----------+-----------------------+
| id | select_type | table    | partitions | type  | possible_keys        | key                  | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+----------+------------+-------+----------------------+----------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | salaries | NULL       | range | idx_salary_from_date | idx_salary_from_date | 7       | NULL |   15 |   100.00 | Using index condition |
+----+-------------+----------+------------+-------+----------------------+----------------------+---------+------+------+----------+-----------------------+
```

インデックスを貼った後の実行速度(0.0008s かなり早くなった)

```text
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID  | duration | SQL_TEXT                                                                                                                             |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| 127853018 | 0.000742 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127853034 | 0.000801 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127853050 | 0.000869 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127853066 | 0.000779 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
| 127853082 | 0.000706 | SELECT * FROM salaries WHERE salary = '60117' AND from_date >= '2000-01-01'                                                          |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

</details>

### クイズ 3

**employees テーブル,departments テーブル,current_dept_emp テーブルを用いて、1995 年よりも後に就業し、1960 年生まれで、現在の部門が「Production」の従業員一覧を取得してください。(emp_no, birth_date, hire_date, dept_name を出力してください。)**

<details><summary>回答</summary>

想定されるクエリと実行結果

```sql
SELECT
  employees.emp_no,
  employees.birth_date,
  employees.hire_date,
  departments_per_emp.dept_name
FROM
  employees
INNER JOIN (
  SELECT
    current_dept_emp.emp_no,
    departments.dept_name
  FROM
    current_dept_emp
  INNER JOIN departments ON current_dept_emp.dept_no = departments.dept_no
  WHERE current_dept_emp.dept_no = 'd004'
) AS departments_per_emp
ON employees.emp_no = departments_per_emp.emp_no
WHERE hire_date > DATE('1995-01-01')
AND birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
```

想定される実行結果(583rows)

```text
+--------+------------+------------+------------+
| emp_no | birth_date | hire_date  | dept_name  |
+--------+------------+------------+------------+
| 490687 | 1960-04-30 | 1995-01-05 | Production |
| 406011 | 1960-07-25 | 1995-01-06 | Production |
|  87703 | 1960-10-21 | 1995-01-10 | Production |
| 223728 | 1960-10-22 | 1995-01-13 | Production |
| 275892 | 1960-12-13 | 1995-01-13 | Production |
|  95171 | 1960-11-16 | 1995-01-14 | Production |
| 206609 | 1960-09-10 | 1995-01-15 | Production |
|  43904 | 1960-03-16 | 1995-01-18 | Production |
| 433912 | 1960-10-30 | 1995-01-19 | Production |
| 414554 | 1960-05-02 | 1995-01-20 | Production |
|  58558 | 1960-06-12 | 1995-01-20 | Production |
(中略)
+--------+------------+------------+------------+
```

インデックスを貼る前の実行速度(1s)

```text
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|  EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| 127851953 | 1.025146 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127851988 | 0.970500 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127852023 | 0.964459 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127852058 | 1.107145 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127852093 | 1.301923 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

インデックスを貼る前の EXPLAIN

```sql
+----+-------------+-------------+------------+--------+-----------------+-------------+---------+----------------------------------------------------------------------+--------+----------+-------------+
| id | select_type | table       | partitions | type   | possible_keys   | key         | key_len | ref                                                                  | rows   | filtered | Extra       |
+----+-------------+-------------+------------+--------+-----------------+-------------+---------+----------------------------------------------------------------------+--------+----------+-------------+
|  1 | PRIMARY     | departments | NULL       | const  | PRIMARY         | PRIMARY     | 4       | const                                                                |      1 |   100.00 | NULL        |
|  1 | PRIMARY     | employees   | NULL       | ALL    | PRIMARY         | NULL        | NULL    | NULL                                                                 | 299069 |     3.70 | Using where |
|  1 | PRIMARY     | d           | NULL       | eq_ref | PRIMARY,dept_no | PRIMARY     | 8       | employees.employees.emp_no,const                                     |      1 |   100.00 | NULL        |
|  1 | PRIMARY     | <derived4>  | NULL       | ref    | <auto_key0>     | <auto_key0> | 12      | employees.employees.emp_no,employees.d.from_date,employees.d.to_date |     10 |   100.00 | Using index |
|  4 | DERIVED     | dept_emp    | NULL       | index  | PRIMARY,dept_no | PRIMARY     | 8       | NULL                                                                 | 331570 |   100.00 | NULL        |
+----+-------------+-------------+------------+--------+-----------------+-------------+---------+----------------------------------------------------------------------+--------+----------+-------------+
```

employees テーブルの hire_date, birth_date にインデックスを貼る

```sql
mysql> CREATE INDEX idx_hire_date_birth_date ON employees(hire_date, birth_date);

mysql> SHOW INDEX FROM employees;
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name                 | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY                  |            1 | emp_no      | A         |      299069 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_hire_date_birth_date |            1 | hire_date   | A         |        5108 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | idx_hire_date_birth_date |            2 | birth_date  | A         |      298322 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
```

インデックスを貼った後の EXPLAIN。複合インデックスが行われていることが分かる。

```sql
+----+-------------+-------------+------------+--------+----------------------------------+--------------------------+---------+----------------------------------------------------------------------+--------+----------+--------------------------+
| id | select_type | table       | partitions | type   | possible_keys                    | key                      | key_len | ref                                                                  | rows   | filtered | Extra                    |
+----+-------------+-------------+------------+--------+----------------------------------+--------------------------+---------+----------------------------------------------------------------------+--------+----------+--------------------------+
|  1 | PRIMARY     | departments | NULL       | const  | PRIMARY                          | PRIMARY                  | 4       | const                                                                |      1 |   100.00 | NULL                     |
|  1 | PRIMARY     | employees   | NULL       | range  | PRIMARY,idx_hire_date_birth_date | idx_hire_date_birth_date | 3       | NULL                                                                 |  63352 |    11.11 | Using where; Using index |
|  1 | PRIMARY     | d           | NULL       | eq_ref | PRIMARY,dept_no                  | PRIMARY                  | 8       | employees.employees.emp_no,const                                     |      1 |   100.00 | NULL                     |
|  1 | PRIMARY     | <derived4>  | NULL       | ref    | <auto_key0>                      | <auto_key0>              | 12      | employees.employees.emp_no,employees.d.from_date,employees.d.to_date |     10 |   100.00 | Using index              |
|  4 | DERIVED     | dept_emp    | NULL       | index  | PRIMARY,dept_no                  | PRIMARY                  | 8       | NULL                                                                 | 331570 |   100.00 | NULL                     |
+----+-------------+-------------+------------+--------+----------------------------------+--------------------------+---------+----------------------------------------------------------------------+--------+----------+--------------------------+
```

インデックスを貼った後の実行速度(0.9s)若干早くなった気がするが、JOIN して、範囲の絞り込みだと、あまり効果はないのかも...？

```text
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
|  EVENT_ID | duration | SQL_TEXT                                                                                                                             |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
| 127851721 | 0.901479 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127851756 | 0.903056 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127851791 | 0.909074 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127851826 | 0.891858 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
| 127851546 | 0.897617 | SELECT employees.emp_no, employees.birth_date, employees.hire_date, departments_per_emp.dept_name FROM (略)                          |
+-----------+----------+--------------------------------------------------------------------------------------------------------------------------------------+
```

</details>

## 今回新しく使用した SQL のコマンド

```sql

--- 複合インデックスの作成

CREATE INDEX index_name ON table_name(column1, column2, column3)

```

## 余談

クエリが複雑になると、データ出力した時の表示が辛くなるので、何か方法を探したい。
