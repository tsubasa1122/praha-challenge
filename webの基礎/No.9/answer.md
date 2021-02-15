**課題１（質問）**

- 未経験でエンジニアとして採用されて昨日から入社した新人くんに「先輩、XMLHttpRequest って何ですか？（ブラウザのアドレスバーに URL を入力して送信する）普通の HTTP リクエストと何が違うんですか？」とキラキラした目で聞かれました新人くんに分かるように、説明してあげてください
  XMLHttpRequest は普通の HTTP 通信と同じく、クライアントがサーバーにリクエストを送り、そのレスポンスとしてサーバーからクライアントにデータを返信出来るというものです。ヘッダーの送受信も出来ますし、キャッシュの制御、クッキーの送受信など、内容はほぼ変わりません。
  ブラウザの HTTP リクエストの違いとしては、以下の点が異なります。

  - 送受信時に HTML の画面がフラッシュ(リロード)されない。
  - メソッドとして、GET と POST 以外も送信出来る。(※form タグは GET・POST メソッドしかサポートされていません。PUT や DELETE は hidden 属性で\_method を付与することで対応可能です。)

  ```
  <input name="_method" type="hidden" value="patch" />
  ```

  参考：
  http://jxck.hatenablog.com/entry/why-form-dosent-support-put-delete
  https://www.w3schools.com/tags/tag_form.asp

  - フォームの場合、キーと値が 1:1 になっている形式のデータしか送信出来ず、レスポンスはブラウザで表示されてしまうが、プレーンテキスト、JSON、バイナリデータ、XML など、さまざまなフォーマットが送受信出来る。
  - いくつか、セキュリティのための制約がある。(SOP や CORS の設定など)
    参考：「Real World HTTP 第 2 版」

- 新人くんが翌週、こんなことを聞いてきました。「先輩・・・僕、example.com っていうサイトを担当することになって。example.com のページから api.example.com（API）に向けて、XMLHttpRequest を使ってリクエストを送信するコードを書いたんですけど、リクエストにクッキー情報が付与されないんです・・・どうしてですか？」新人くんのコードを見た所、送信部分はこのように記述されていました。どこに問題があるのか、説明してあげてください

```
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://api.example.com/', true);
xhr.send(null);
```

XMLHTTPRequest で Cookie などの認証情報を送信するためには、`withCredentials`の設定を true にする必要があります。以下のように記述を修正することで、Cookie が送信されるようになります。

```
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://api.example.com/', true);
xhr.withCredentials = true;
xhr.send(null);
```

※サーバー側にも以下の設定を入れる必要があります。

- `Access-Control-Allow-Credential: true`をレスポンスのヘッダーに設定する。
- `Access-Control-Allow-Origin`ヘッダーには`*`ではなく、オリジンを指定(今回の例だと`example.com`を指定)してレスポンスを返す。

参考：
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

- 翌週、新人くんが涙目でこんなことを聞いてきました。「先輩・・・CORS って分かりますか？なんか**「No 'Access-Control-Allow-Origin' header is present on the requested resource」**ってエラーが出てきて、リクエストが送られなくて・・・どうすればいいんでしょうか？」新人くんに説明してあげてください。

リクエストを送る前に、送信していいかどうかを確認する preflight request がサーバーに送られ、サーバーからのレスポンスに設定されている`Access-Control-Allow-Origin`ヘッダーに、フロントからのリクエスト元のオリジンが含まれていないことによって、ブラウザが許可されていないリクエストとみなしてしまい、エラーが発生してしまっています。
解決方法としては、フロントからのリクエスト元のオリジン`example.com`をサーバー側の`Access-Control-Allow-Origin`ヘッダーの設定に含めることで、許可されたリクエストと判断されて、リクエストが送信出来るようになります。
