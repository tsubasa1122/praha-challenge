## 課題１（質問）

### 「ビュー」の仕組み

- 実テーブルから作成される仮想的なテーブルのことです。ビューはあくまでも仮想テーブルなので、テーブル内にデータは存在しません。
- ビューの実態は SELECT 文によるクエリを定義したもので、ビューにアクセスすると、定義されたクエリが実行され、実テーブルから必要なデータが抽出されます。
  - あくまでも SELECT 文を持っているだけなので、実行の度に演算を行うため、最新の情報を反映させることが出来ます。
- CREATE TABLE で定義された、データの入ったテーブルのことを実テーブル、実テーブルから作られる仮想的なテーブルをビューと呼びます。

参考：
https://www.techscore.com/tech/sql/SQL9/09_01.html/

### 「ビュー」の用途やメリット

- 用途

頻繁に利用する且つ、複雑なクエリを効率化したいときに使われる。(開発速度の向上 -> クエリの実行速度ではない)

- メリット

複雑なクエリを一度ビューとして定義しておけば、ユーザーやプログラムは単純なクエリを実行するだけですむようになるため、SQL をシンプルに出来る。
また、実テーブルのデータの中に一般ユーザーに見せたくないものがある場合、実テーブルへのアクセス制限を一般ユーザーに与えることが出来ませんが、見せたくないデータを除いたビューを定義することにより、一般ユーザでもアクセス出来るようにセキュリティの対策を行うことが出来ます。(※ビューの作成を間違えると事故が発生する可能性が高いので、ビューでアクセスを管理するより、テーブルを分けるなどした方が良いと個人的には思います)

### Materialized View の違い

- Materialized view は「SQL の結果をテーブルとして保持する仕組み」です。
- 「ビュー」の場合、SELECT 文を実態として保持しているだけでしたが、Materialized view の場合はデータも一緒に保持するため、パフォーマンス向上を目的に利用されます。

参考：
https://qiita.com/wanko5296/items/61c3e6ec4561b26beb5c

### メモ

- Materialized view で定義したカラムに対して、index を貼れるらしい。

https://postgresweb.com/post-5173

- ビューを用いた値の更新も出来るみたいだけれども、実務で使うケースはあるのだろうか？

- この[スライド](https://www.slideshare.net/SoudaiSone/postgre-sql-54919575)を見ていて疑問に思ったこと
  - Materialized view の使い道はどこら辺にあるのだろうか？
    - クエリが複雑 and 更新頻度が少ない or 最新のデータをユーザーに返す必要がない箇所だろうか(REFRESH MATERIALIZED VIEW を毎回行わないとビューのデータは更新されないため、更新頻度が多いと使い辛そう。)
      - BI ツールとか？
  - 削除フラグなどの状態をテーブルなどに保持するのはアンチパターンで、事実だけを格納するべきと書いてあるが、とはいえ「会員ユーザー」「有料会員ユーザー」「退会ユーザー」など、状態毎にテーブルを分けると逆に管理がキツくなる気がしている。
    - テーブルを分ける or カラムでフラグを付ける基準はどうしているんだろう？

## 課題２（実装）

JOIN を使っていて、複雑そうな以下のクエリを選択しました。

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
WHERE hire_date >= DATE('1996-01-01')
AND birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
```

1s くらい実行時間が掛かっている。

```text
+----------+----------+------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | left(SQL_TEXT, 100)                                                                                  |
+----------+----------+------------------------------------------------------------------------------------------------------+
|      105 | 1.085286 | SELECT   employees.emp_no,   employees.birth_date,   employees.hire_date,   departments_per_emp.dept |
|      141 | 1.007805 | SELECT   employees.emp_no,   employees.birth_date,   employees.hire_date,   departments_per_emp.dept |
|      177 | 1.016985 | SELECT   employees.emp_no,   employees.birth_date,   employees.hire_date,   departments_per_emp.dept |
+----------+----------+------------------------------------------------------------------------------------------------------+
```

View を作る

```sql
-- view 作成
CREATE VIEW view_name AS (SELECT ~);

-- viewの確認
SHOW CREATE VIEW view_name;
```

今回は test という名前の view を作成した

```sql
mysql> SHOW CREATE VIEW test \G

*************************** 1. row ***************************
View: test
Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `test` AS select `employees`.`employees`.`emp_no` AS `emp_no`,`employees`.`employees`.`birth_date` AS `birth_date`,`employees`.`employees`.`hire_date` AS `hire_date`,`departments_per_emp`.`dept_name` AS `dept_name` from (`employees`.`employees` join (select `current_dept_emp`.`emp_no` AS `emp_no`,`employees`.`departments`.`dept_name` AS `dept_name` from (`employees`.`current_dept_emp` join `employees`.`departments` on((`current_dept_emp`.`dept_no` = `employees`.`departments`.`dept_no`))) where (`current_dept_emp`.`dept_no` = 'd004')) `departments_per_emp` on((`employees`.`employees`.`emp_no` = `departments_per_emp`.`emp_no`))) where ((`employees`.`employees`.`hire_date` >= cast('1996-01-01' as date)) and (`employees`.`employees`.`birth_date` between cast('1960-01-01' as date) and cast('1960-12-31' as date)))
character_set_client: latin1
collation_connection: latin1_swedish_ci
```

view に対して、クエリを実行した

```sql
mysql> SELECT * FROM test;
```

**速度がほとんど変わってない**SELECT 句を保存しているだけなので、変化しないことが分かる。

```text
+----------+----------+------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | left(SQL_TEXT, 100)                                                                                  |
+----------+----------+------------------------------------------------------------------------------------------------------+
|      424 | 1.007475 | SELECT * FROM test                                                                                   |
|      467 | 1.023796 | SELECT * FROM test                                                                                   |
|      510 | 1.018573 | SELECT * FROM test                                                                                   |
+----------+----------+------------------------------------------------------------------------------------------------------+
```
