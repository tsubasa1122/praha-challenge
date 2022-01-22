## 課題１（実装）

### スロークエリログの設定

- 現在の設定確認

```sql
-- スロークエリ出力確認
mysql> SHOW GLOBAL VARIABLES LIKE '%slow_query%' ;

-- スロークエリを出力する閾値確認
mysql> SHOW GLOBAL VARIABLES LIKE '%query_time%' ;
```

- ログ出力するように設定する

```sql
-- ログ出力をONにする
mysql> SET GLOBAL slow_query_log = 'ON' ;

-- 閾値を変更する(今回は0.1s以上時間が掛かるクエリをログ出力する)
mysql> SET GLOBAL long_query_time = 0.1 ;
```

参考:
https://qiita.com/bohebohechan/items/30103a0b79a520e991fa
https://masayuki14.hatenablog.com/entry/20120704/1341360260

### 0.1 秒以下のクエリを 3 つ

以下のクエリを実行しました。

```sql
SELECT * FROM employees limit 5;
5 rows in set (0.01 sec)

SELECT * FROM employees WHERE emp_no = '10001';
1 row in set (0.01 sec)

SELECT * FROM salaries limit 5;
5 rows in set (0.00 sec)
```

### 0.1 秒以上のクエリを 3 つ

以下のクエリを実行しました。

```sql
SELECT * FROM employees WHERE hire_date > '1989-01-01';
163546 rows in set (0.17 sec)

SELECT last_name FROM employees GROUP BY last_name;
1637 rows in set (0.11 sec)

SELECT * FROM salaries WHERE salary = 100391;
7 rows in set (0.44 sec)

-- 以下はボツ
SELECT * FROM employees;
300024 rows in set (0.18 sec)

SELECT * FROM salaries;
2844042 rows in set (2.01 sec)
```

スロークエリログの出力結果

```text
xTime                 Id Command    Argument
# Time: 2021-04-06T00:49:54.982920Z
# User@Host: root[root] @ localhost []  Id:     6
# Query_time: 0.167584  Lock_time: 0.000242 Rows_sent: 163546  Rows_examined: 300024
SET timestamp=1617670194;
SELECT * FROM employees WHERE hire_date > '1989-01-01';
# Time: 2021-04-04T14:35:45.460642Z
# User@Host: root[root] @ localhost []  Id:     4
# Query_time: 0.117886  Lock_time: 0.000090 Rows_sent: 1637  Rows_examined: 303298
SET timestamp=1617546945;
SELECT last_name FROM employees GROUP BY last_name;
# Time: 2021-04-06T00:53:09.313217Z
# User@Host: root[root] @ localhost []  Id:     6
# Query_time: 4.222627  Lock_time: 0.000137 Rows_sent: 91137  Rows_examined: 91137
SET timestamp=1617670389;
select * from salaries where salary > 100391;
```

## 課題２（実装）

### 最も頻度高くスロークエリに現れるクエリ

```bash
mysqldumpslow -s c -t 1 [スロークエリログ]
```

### 実行時間が最も長いクエリ

```bash
mysqldumpslow -s t -t 1 [スロークエリログ]
```

### ロック時間が最も長いクエリ

```bash
mysqldumpslow -s l -t 1 [スロークエリログ]
```

参考:
https://dev.mysql.com/doc/refman/8.0/en/mysqldumpslow.html

## 課題３（実装）

### 最も頻度高く発生するスロークエリ

mysqldumpslow を用いて、頻度高く発生するクエリを抽出した。

```bash
mysqldumpslow -s c -t 1 /var/lib/mysql/6ddc4b0808e5-slow.log

Reading mysql slow query log from /var/lib/mysql/6ddc4b0808e5-slow.log
Count: 11  Time=0.22s (2s)  Lock=0.00s (0s)  Rows=1637.0 (18007), root[root]@localhost
SELECT last_name FROM employees GROUP BY last_name
```

インデックスを貼った。

```sql
CREATE INDEX idx_last_name ON employees(last_name);
```

**改善後**

```sql
mysql> SELECT last_name FROM employees GROUP BY last_name;
1637 rows in set (0.01 sec)
```

スロークエリログを見ても、ログがカウントアップされていないことが分かる。

```bash
mysqldumpslow -s c -t 1 /var/lib/mysql/6ddc4b0808e5-slow.log

Reading mysql slow query log from /var/lib/mysql/6ddc4b0808e5-slow.log
Count: 11  Time=0.22s (2s)  Lock=0.00s (0s)  Rows=1637.0 (18007), root[root]@localhost
SELECT last_name FROM employees GROUP BY last_name
```

### 実行時間が最も長いスロークエリ

mysqldumpslow を用いて、頻度高く発生するクエリを抽出した。

```bash
mysqldumpslow -s t -t 1 /var/lib/mysql/6ddc4b0808e5-slow.log

Reading mysql slow query log from /var/lib/mysql/6ddc4b0808e5-slow.log
Count: 9  Time=0.44s (3s)  Lock=0.00s (0s)  Rows=7.0 (63), root[root]@localhost
SELECT * FROM salaries WHERE salary = N
```

インデックスを貼った。

```sql
CREATE INDEX idx_salary ON salaries(salary);
```

**改善後**

```sql
mysql> SELECT * FROM salaries WHERE salary = 100391;
7 rows in set (0.00 sec)
```

スロークエリログを見ても、ログがカウントアップされていないことが分かる。

```bash
mysqldumpslow -s c -t 1 /var/lib/mysql/6ddc4b0808e5-slow.log

Reading mysql slow query log from /var/lib/mysql/6ddc4b0808e5-slow.log
Count: 9  Time=0.44s (3s)  Lock=0.00s (0s)  Rows=7.0 (63), root[root]@localhost
SELECT * FROM salaries WHERE salary = N
```

## 課題４（質問）

### LIMIT 1 が遅い理由

- SQL の実行順序により、LIMIT 句は処理の最後に実行されるため、クエリの条件に当てはまるレコードは全て読み込まれてしまうので遅くなる。

  (例) employees テーブルの LIMIT 1 を取得する際の EXPLAIN

```sql
mysql> EXPLAIN SELECT * FROM employees LIMIT 1;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------+
```

rows の値を見ると、1 件のデータを取り出すために 299069 のレコードを読み込んでいることが分かる。

(注)
MYSQL には、[LIMIT クエリの最適化](https://dev.mysql.com/doc/refman/5.6/ja/limit-optimization.html)という仕組みがあるため、ORDER BY 句にインデックスを貼ったカラムを指定すると、LIMIT 句で指定した件数だけを返すようになるため、クエリによっては LIMIT を使っても遅くならない。

last_name にインデックスを貼り、order by してみると rows が 1 件になっていることが分かる。

```sql
mysql> EXPLAIN SELECT * FROM employees ORDER BY last_name LIMIT 1;
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key           | key_len | ref  | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | index | NULL          | idx_last_name | 18      | NULL |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-------+
```

参考：
https://qiita.com/k_0120/items/a27ea1fc3b9bddc77fa1

**メモ**

```sql
SELECT * FROM employees LIMIT 1;
1 row in set (0.01 sec)
```

上記の例で出したクエリを実行すると、対して遅くなかった。
レコードを 3 万件程度読み込んで、先頭から 1 件返すくらいなら、パフォーマンスには影響しないのだろうか？？

LIMIT クエリ最適化には、

> ORDER BY とともに LIMIT row_count を使用した場合、MySQL では、結果全体をソートするのではなく、ソートされた結果の最初の row_count 行が見つかるとすぐにソートを終了します。インデックスを使用して順序付けが行われている場合、これはきわめて高速になります。filesort を実行する必要がある場合、最初の row_count を見つける前に、LIMIT 句を使用しないクエリーに一致するすべての行が選択され、それらのほとんどまたはすべてがソートされます。初期の行が見つかったら、MySQL は結果セットの残りをすべてソートしません。

と書かれているが、インデックスを貼っていないカラムを ORDER BY に指定するとかなり遅くなる。
内部的には、LIMIT で指定した件数を返しているが、全件ソートしているから遅くなる？？

### ON で絞った方が良い理由

実行順序が ON -> JOIN -> WHERE のため、悪いクエリの場合は全てのテーブルを JOIN した後レコードを絞り込んでしまっています。そのため、読み込むレコード数が多くなってしまい、実行速度が遅くなります。
また、MYSQL は[Nested Loop JOIN](https://dev.mysql.com/doc/refman/5.6/ja/nested-loop-joins.html)を行うため、JOIN 時には各レコード毎に JOIN 先のテーブルに一致するレコードを頭から探す処理を行うため、JOIN するレコードが多いほどテーブルの負荷が上がります。
以上のことから、事前に ON 句で JOIN するレコード数を減らした方が DB の負荷が減り、実行速度が早くなるため、 ON で絞った方が良いです。

参考：
MYSQL の内部構造について、分かりやすい動画
https://www.youtube.com/watch?v=R-48tlyAsCk

performance_schema.events_statements_history を見ると、実際にクエリを実行した際に目的のレコードを返却するために精査したレコード数が見れるという話
https://blog.kamipo.net/entry/2018/03/22/084126

## 課題５(クイズ)

No.1

スロークエリログの`Rows_sent`と`Rows_examined`はどのような意味を持つ項目でしょうか？

<details><summary>回答</summary>
Rows_sent： 取得行数
Rows_examined：探索対象行数

参考：
http://naoberry.com/tech/slowquery/

</details>

No.2

mysqldumpslow を用いて、WHERE などに指定した数字や文字列を実際に検索された値でみたい場合はどのようなオプションを付ければいいでしょうか？(N や S などの抽象表現ではなく)

<details><summary>回答</summary>

`-a`オプションを付ける。

参考：
https://dev.mysql.com/doc/refman/5.6/ja/mysqldumpslow.html#option_mysqldumpslow_abstract

</details>

No.3

以下のような複合インデックスを貼りました。(last_name, first_name)

```sql
CREATE INDEX idx_last_name_first_name ON employees(last_name, first_name);
```

以下の二つのクエリはそれぞれインデックスが効くでしょうか？

```sql
SELECT * FROM employees ORDER BY last_name, first_name limit 5;
SELECT * FROM employees ORDER BY last_name DESC, first_name ASC limit 5;
```

<details><summary>回答</summary>

- 1 つ目のクエリはインデックスが効く。

```sql
mysql> EXPLAIN SELECT * FROM employees ORDER BY last_name, first_name limit 5;
+----+-------------+-----------+------------+-------+---------------+--------------------------+---------+------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key                      | key_len | ref  | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+--------------------------+---------+------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | index | NULL          | idx_last_name_first_name | 34      | NULL |    5 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+--------------------------+---------+------+------+----------+-------+
```

- 2 つ目のクエリはインデックスが効かない。

```sql
mysql> EXPLAIN SELECT * FROM employees ORDER BY last_name DESC, first_name ASC limit 5;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra          |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299069 |   100.00 | Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------+
```

</details>
