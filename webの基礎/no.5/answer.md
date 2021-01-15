## 課題 1

### 質問 1

- Cookie の発行元がどこのドメインかで分類されます。ユーザーがアクセスしたサイトから発行される Cookie がファーストパーティ Cookie、それ以外のドメインから発行される Cookie はサードパーティー Cookie になります。例えば、ユーザーが A.com のサイトにアクセスした際に、A.com から発行される Cookie はファーストパーティ Cookie になり、サイト内に設定した B.com から配信されるバナー広告などがユーザーのトラッキングなどを計測するために発行する Cookie はサードパーティー Cookie になります。
  (余談ですが、ファーストパーティーかどうかの判断は base domain を用いて行っているため、A.com にアクセスした際に api.A.com のサブドメインが発行した Cookie もファーストパーティー Cookie として扱われます。また、SPA のようにフロントと API サーバーが別れたサービス間で Cookie のやりとりを行う場合、フロントとサーバー側の両方で Allow-Control-Allow-Credentials の設定を true にする必要があります。)

### 質問 2

- A.com と B.com に Google AdSense を設置します。A.com にユーザーがアクセスした際、Google AdSense の広告配信サーバーから広告の配信と共にサードパティー Cookie が発行されます。その際、サードパティー Cookie にはユーザーを一意に識別する ID が保存され、Referer から A.com からのアクセスを記録します。今度は B.com にアクセスすると、A.com にアクセスした際に発行された Cookie が広告配信サーバーに送られることにより、Cookie に格納されたユーザーの識別子と Referer から、ユーザーが A.com と B.com にアクセスしたことが分かるようになります。
  参考：https://ja.javascript.info/cookie#ref-50

### 質問 3

- img タグで参照された画像や Script タグで指定した JS を返す時に Set-Cookie ヘッダーを含める方法。(課題 2 のような仕組み)

- iframe タグからフォームを作成して送信する方法(実際の実装例はわからず...)
  参考：https://stackoverflow.com/questions/4701922/how-does-facebook-set-cross-domain-cookies-for-iframes-on-canvas-pages/4702110#4702110

- ポップアップウインドウを表示する方法
  参考：https://gimmicklog.com/jquery/359/

- JavaScript で postMessage()を使って他のサイトを開いているウインドウと情報をやりとりする方法(postMessage と iframe を使って message のやりとり(PostMessageApp 参照)は出来たが、Cookie のやりとりを行う方法がわからず...。メンターに相談したい。)
  参考：https://qiita.com/yasumodev/items/d339a875b4b9bf65d156#comments

### 質問 4

- Google Chrome
  Chrome 80 からサードパーティー Cookie の設定がデフォルトで none -> Lax に変わったため、明示的に SameSite=none を設定しないと Cookie を送信しない。
  2022 年の 1 月頃には、サードパーティー Cookie をサポートしなくなると発表されました。
  参考：https://webtan.impress.co.jp/e/2020/09/03/36910

- Safari
  Safari 13.1 ではデフォルトで全てのユーザーに対してサードパーティー Cookie がブロックされている。
  参考：https://www.infoq.com/jp/news/2020/06/safari-third-party-cookies-block/

- Firefox
  Firefox 67.0.1 以降にダウンロードするとデフォルトでサードパーティー Cookie がブロックされる設定が入った。
  参考：https://www.itmedia.co.jp/news/articles/1906/05/news069.html

- Microsoft Edge
  デフォルトではサードパーティー Cookie をブロックする設定は入っていなさそう。ユーザー側でサードバーティ Cookie のみをブロックする設定を入れることが出来る。
  参考：https://windows10-help.com/476/

### 質問 5

- ファーストパーティー Cookie です。base domain が同じであれば、ファーストパーティー Cookie と認識されます。(今回の例だと、base domain は hoge.com)
