## 課題 1

### 以下の単語を使って CORS の仕組みを説明してください。

- preflight requiest
- simple request
- access-control-allow-origin

CORS はオリジンが異なる外部のリソースに対して、安全にリクエストを送るためのブラウザの仕組みで、リクエストは大きく分けて simple request と preflight request の二つあります。
GET、POST、HEAD かつ特定のリクエストヘッダのみ含むなど、一定の条件を満たすリクエストは simple request を行い、それ以外のリクエストは(例えば、Fetch API を用いて application/json のデータの取得)preflight request が行われます。
simple request の場合、ブラウザはリクエストに Origin ヘッダーを追加し、サーバーにリクエストを送ります。サーバーは Origin ヘッダーを確認し、CORS の設定に定義してある Origin と比較し、一致するものがあるかどうかを確認します。一致するものがあればレスポンスヘッダーに Access-Control-Allow-Origin を含めて、レスポンスを返します。レスポンスを受け取ったブラウザは、Access-Control-Allow-Origin の値を確認し、\*もしくは Origin と一致していればリクエストが成功します。
[simple request について](https://ja.javascript.info/fetch-crossorigin#ref-269)

preflight request の場合、リクエストの始めに OPTIONS メソッドによる HTTP リクエストを送り、実際のリクエストを送信しても安全かどうかを確かめます。simple request と同様に、ブラウザはリクエストに Origin ヘッダーを追加し、サーバーにリクエストを送ります。サーバーは Origin ヘッダーと CORS の設定に定義してある Orgin と比較し、一致するものがあれば、Access-Control-Allow-Origin をヘッダーに含めてレスポンスを返します。レスポンスを受け取ったブラウザは、Access-Control-Allow-Origin の値とブラウザの Origin を比較し、一致していれば実際のリクエストをサーバーに送信することが出来、レスポンスを受け取ってリクエストが成功します。
[preflight request について](https://ja.javascript.info/fetch-crossorigin#ref-271)

### CORS の仕組みがない場合、どのような不都合が生じるのでしょうか？

ブラウザの仕様で[同一生成元ポリシー](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)が設定されているため、ページが生成されたオリジン(今回のオリジンはスキーム・ホスト・ポートが全て一致しているものを指す)以外のサーバーと通信することが出来ない(正確にはクロスオリジンのリソース使用)。CORS は同一生成元ポリシーの制約がある中で、安全に外部のサーバーへ通信する仕組みなので、もしこの仕組みがない場合、JavaScript の XHR などを用いて外部のサーバーからリソースを取得することが出来なくなってしまう。([JSONP](https://blog.ohgaki.net/stop-using-jsonp)を用いたクロスオリジンとの通信方法は存在するが非推奨。)

### 「Access-Control-Allow-Origin: \*」の設定が問題となるケースを 1 つ挙げて、なぜ設定すべきではないのか、説明してください。

- 問題となるケース
  Access-Control-Allow-Origin: \*を設定した api.hoge.com と悪意のあるサイト evil.com があるとします。ユーザーが誤って evil.com にアクセスしてしまい、evil.com から悪意のある Script ファイルをダウンロードします。Script ファイルから、XHR を用いて api.hoge.com へ JSON データを取得するリクエストを送ると Access-Control-Allow-Origin の設定により全てのオリジンに対してデータにアクセスすることを許可するレスポンスを返すようになっているため、JSON データへのアクセスが出来てしまいます。
  ※言葉ではわかり辛いため、シーケンス図を用いて図解してみました。(PR でレビューする際は answer.md を View file すると画像が表示されます)
  ![問題となるケースのシーケンス図](./images/allow-origin-sample.png '問題となるケースのシーケンス図')

- なぜ設定するべきではないのか
  上記の問題となるケースに記載されているように、悪意のあるサイトからデータにアクセスすることが出来てしまうため、それによって、データを悪用されてしまう可能性があります。今回の例では、データの取得を出しましたが、データの追加・更新・削除も出来るようになってしまいます。許可するべきオリジンだけを設定することを推奨します。
  参考：
  https://www.youtube.com/watch?v=ryztmcFf01Y

### preflight request が送信されない「シンプルなリクエスト」に該当するための条件を説明してください

- リクエストのメソッドが GET・POST・HEAD のいずれかの場合
- Content-Type ヘッダーが application/x-www-form-urlencoded, multipart/form-data, text/plain のいずれかに設定されている場合
- 以下の一般的なヘッダのみで、特殊なヘッダが存在しない場合
  - Accept
  - Accept-Language
  - Content-Language
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width

参考：
https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#simple_requests
https://yamory.io/blog/about-cors/

### シンプルなリクエストの場合は preflight リクエストが送信されず、そのままリクエストがサーバに到達します。サーバからのレスポンスの Access-Control-Allow-Origin ヘッダーに、リクエスト送信元のオリジンが含まれない場合、ブラウザはどのような挙動を取るでしょうか？

- ブラウザはレスポンスを受け取っても、データをフロントエンド(JavaScript)には返さずに例外を発生します。

### XMLHttpRequest を使ってクロスオリジンリクエストを発行する際、デフォルトの挙動だとリクエストにクッキーが含まれません。クッキー情報を含むためには、何をする必要があるでしょうか？

フロントエンドとサーバーのどちらにも資格情報を含める設定(Access-Control-Allow-Credentials)を入れる必要があります。
具体的には、

サーバー側では下記のようなレスポンスをヘッダーに含めます。資格情報を含めない場合は false ではなく、Access-Control-Allow-Credentials 自体を付けません。また、資格情報を含めた通信を行う際は、Access-Control-Allow-Origin に\*(全てのオリジンを許可する設定)を付けることが出来ないため、具体的なオリジンを設定する必要があります。

```
Access-Control-Allow-Credentials: true
```

参考：https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials

## 課題 2(クイズ)

No.1：HTTP ヘッダーには、URL の情報を取得するために使用する`Referer`ヘッダーがありますが、CORS では`Origin`ヘッダー使用される理由はなんでしょうか？

No.2：Access-Control-Allow-Methods ヘッダーはどのような役割をしているでしょうか？

No.3：次の３つは同一生成元ポリシーが適用されますか？JavaScript での非同期通信（XMLHttpRequest や Fetch API を使った通信）・<script>タグの src 属性で読み込んだ JavaScript・<img>タグの src 属性で読み込んだ画像

## 課題 3(実装)

## 課題 4(成果物に関する質問)

### 作成した成果物に、試しに CURL で、「Simple request」に該当しない POST リクエストを送信してみましょう。果たして CURL からのリクエストを受けた時、CORS 制約は適用されるでしょうか？その理由を説明してください。
