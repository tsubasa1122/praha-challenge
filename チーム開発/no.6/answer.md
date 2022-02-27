# 課題 1（質問）

以下の要望を実現するコマンドを探してみてください

### 特定のコミットとの差分表示

```shell
# 現在のブランチとの差分を表示したい場合(作業ツリーとの差分が全て表示される)
$ git diff <commit id>

# コミットID同士の差分を表示したい場合
$ git diff <commit id1>..<commit id2>

# コミットの変更点のみを表示したい場合
$ git show <commit id1>
```

参考:
https://atmarkit.itmedia.co.jp/ait/articles/2004/23/news034.html

### 差分があるファイル名だけを一覧表示

```shell
$ git diff --name-only

# 変更か追加か削除か知りたい場合
$ git diff --name-status

# これでも見れそう
$ git status
```

### 部分的にステージングに追加する方法

```shell
$ git add -p <ファイルpath>
```

**メモ**

- "s" でさらに分割することができる
- "e" で手動編集できる

### 一時的に変更内容を退避させたい

```shell
# -u オプションをつけると新規作成したファイルも退避できる
$ git stash -u

# 退避した作業一覧を表示
$ git stash list
stash@{0}: WIP on test: xxxx
stash@{1}: WIP on commit-sample: xxxx

# 退避した作業を戻す
$ git stash apply stash@{0}
```

参考:  
https://qiita.com/chihiro/items/f373873d5c2dfbd03250

### 特定ファイルのコミット履歴を見たい

```shell
# --word-diff を使うと表示がコンパクトになる
$ git log -p <ファイルpath>
```

### コミットを 1 つのコミットにまとめる

```shell
# 4こ分のコミットをまとめる例
$ git rebase -i HEAD~4

# これでも良い
$ git rebase -i HEAD~~~~

# もしくは目的のコミットidを指定する
$ git rebase -i <コミットid>

pick 2bd3e3f CI環境を整備してみよう
pick e26cffa feat: チーム開発を円滑にするコツを覚えようを回答
pick b516bae ブランチ戦略を学ぼうを回答した
pick d576642 Apply suggestions from code review
pick f236b78 アジャイル開発を学ぼうを回答した

# Rebase 6ce43a9..6e6f82b onto 6ce43a9 (5 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

- `pick`を`squash`に変えると前のコミットにマージされる
  - コミットメッセージも削除したい場合は `fixup`を使う
  - コミットの順序なども変更できる

参考:  
https://qiita.com/takke/items/3400b55becfd72769214

### 特定のブランチを元に新たなブランチを作成

```shell
$ git checkout -b {作成するブランチ名} {親にするブランチ名}
```

### 最新コミットだけクローンしたい

```shell
$ git clone --depth=1 <リポジトリのURL>
```

- これは知らなかった
  - CI とかで毎回 Clone する時に使用すると、気持ち早くなりそう
  - 調べてる記事があった
    - https://swet.dena.com/entry/2020/12/10/100000

### マージを中断したい

```shell
# コンフリクトをいじっていなければ、マージ前に戻せる
$ git merge --abort

# 色々いじったけど戻したい場合
$ git reset --hard HEAD
```

### 業務でたまーに使うやつ

```shell
# マージコミットをrevertしたい場合
$ git revert -m 1 <コミットid>
```
