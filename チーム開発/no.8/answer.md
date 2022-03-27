# 課題 1（質問）

### Docker とは何でしょうか？

- コンテナ型の仮想環境を作成、配布、実行するためのプラットフォームです
- Docker を用いることにより以下のようなメリットを得られます
  - コード化されたファイルを共有することで、どこでも誰でも同じ環境が作れる
  - 作成した環境を配布しやすい
  - スクラップ＆ビルドが容易にできる
    - VirtualBox などでも上の 2 つのメリットは得られるが、Docker の方がホストマシーンのカーネルを利用する分、軽量で高速に起動、停止が可能になる

参考:  
https://knowledge.sakura.ad.jp/13265/

**用語説明**

- イメージ
  - コンテナの土台となるもの
  - 特定の環境のスナップショット
    - Dockerfile によって作成される
  - 生成されたイメージは Read only
  - イメージは 1 つのイメージで完結しているわけではなく、複数のイメージファイルの積み重ねで作られている
    - イメージ生成のためにイメージ数は少ない方がよい
      - コンテナレイアーに操作対象のパスがない場合、イメージレイアーのファイルを操作する(Union FileSystem)
      - それぞれのイメージを操作するため、イメージ数が多ければその分オーバーヘッドが大きくなる
    - `RUN`,`COPY`, `ADD`などのコマンドを実行する度にイメージが生成されるため、コマンドは極力まとめた方が良い
  - 参考: https://y-ohgi.com/introduction-docker/3_production/image/
- コンテナ
  - スナップショット(イメージ)から起動されたプロセス
  - コンテナ内のプロセスはホストマシンや他のコンテナと隔離されて実行される
  - 基本的に 1 コンテナ 1 プロセス
- ベースイメージ
  - イメージ作成の土台となるもの
  - Dockerfile の `FROM` 命令で内容を指定する
- Docker レジストリ
  - Docker イメージを保管・提供する仕組み
  - 参考: https://docs.docker.jp/registry/index.html
  - 今後は Docker Distribution に置き換わるらしい https://mag.osdn.jp/21/02/10/144200
- ビルドコンテキスト
  - docker build コマンド実行時に指定するディレクトリのこと
  - 指定したディレクトリをカレントディレクトリとして、Dockerfile に記述された`COPY`などのコマンドが実行される
  - 参考: https://www.forcia.com/blog/002273.html
- マルチステージビルド
  - Dockerfile 内に複数の`FROM`を記述できる仕組み
  - アプリケーションのビルド時は必要だけど、実行時要らないものを捨てることでイメージのサイズを大幅に削減することができる
    - ローカルだとホットリロードしたいから本番環境用の仕組みかな？
    - Dockerfile 内に複数環境用のコードを記述する必要があるかなと思ったけど、docker-compose 側で target を指定することができるらしい
      - https://y-ohgi.com/introduction-docker/4_tips/docker-compose/#multi-stage-build
  - 参考: https://qiita.com/polarbear08/items/e6855fc8caea1b03d54f

### Dockerfile のメリット

- コマンドひとつで環境構築が完了できる
- 環境の構築・削除が簡単に行える
- DockerEngine が立ち上がる環境であれば、どこでも同じ環境が作れる
- 環境構築に必要な作業がコード化されているので、内容を把握しやすい
  - git などで管理されていれば、変更点が可視化される

### docker-compose はどのような場面で役立ちそう？

- docker-compose とは？

  - 複数のコンテナを定義し実行するツール
  - イメージのビルドから NetWork の構築や Volume の管理をコードベースで定義して行なってくれる
  - Docker は 1 コンテナ 1 プロセスという思想のため、複数のプロセスを使用したい場合はそれぞれコンテナを分ける必要がある
    - 例えば、Rails アプリ、Redis、MySQL という構成でアプリケーションを作りたい場合はそれぞれ別でコンテナを立てる
      - docker-compose はこれらをまとめてくれる
    - 1 つのコンテナに複数のアプリケーションを入れることもできるが、イメージのサイズが増大し、オーバーヘッドが大きくなるため、非推奨

- 複数のアプリケーションをまとめて扱いたい場面で役立つ

### .dockerignore には何を指定すると良い？

- `.dockerignore`はビルド時に無視するファイル/ディレクトリ名を記述するファイル
- `.git` のようなコンテナ内に不要な情報、 `node_modules` のような上書きされると困るものを記述するとよい
- ビルドコンテキストのルートに置かないと効かないため、注意が必要
  - 参考: https://qiita.com/yucatio/items/f5d23043228cc35fc763#dockerignore-2

### パッケージについて、分割して記述すると問題が生じる理由

- `RUN` 命令文で `apt-get update`だけを使うとキャッシュ問題を引き起こすため、 `apt-get install` 命令が失敗する
  - `RUN`を分けた場合、`RUN`コマンドごとにレイヤーが作られてキャッシュされる
  - 今回だと`apt-get update`単体がキャッシュされるため、初回以降は実行されずに常に古いバージョンを見てしまうことで、インストール可能なパッケージが更新されない
- 参考: https://docs.docker.jp/engine/articles/dockerfile_best-practice.html#run

### ENV NAME='hoge' と RUN export NAME='hoge'の違い

- `ENV NAME='hoge'`の場合は最終的に生成されたイメージでも値が保持されるが、`RUN export NAME='hoge'`の場合は`RUN`コマンド実行中だけ値が変わるため、最終的に生成されたイメージ内では値が保持されない
  - 環境構築時のみ必要な環境変数は`RUN`で実行する
  - 参考: https://docs.docker.jp/engine/reference/builder.html#env

# 課題 2（実装）

### praha-challenge の DDD 課題を Docker 化する

- 下記の PR にて、対応しました
  https://github.com/tsubasa1122/praha-challenge-ddd/pull/8

### メモ

- dockerignore の設定確認方法
  - https://jablogs.com/detail/69302
- prisma の設定ファイルも volume に入れても良いかも？
- コンテナ経由だと DB への接続方法が変わるっぽい
  - https://qiita.com/rebi/items/e9625cedf0d41d1cfa28#%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%A8%E3%81%AE%E9%81%AD%E9%81%87
  - https://qiita.com/mm36/items/a743a831fd5cd4324907
