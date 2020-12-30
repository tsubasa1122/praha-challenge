# 回答

## 以下のヘッダーの意味と、役割を説明してください

### Host

リクエスト送信時に設定する、HTTP/1.1 で唯一必須のパラメーター。
ブラウザからサーバに対して、サーバ名(URI のホスト名とポート番号)を送信します。
一台のサーバーで複数のドメイン割り当てることが出来る、バーチャルホストの仕組みを利用した際に Host ヘッダでホスト名を指定することにより、仮想的に 2 つのサーバとして振舞うことが可能になります。

（例）

```
Host: example.com:8000
```

### Content-type

リクエスト/レスポンス送信時に設定するパラメーター。
ボディに含まれるコンテンツのデータ形式(メディアタイプ)を MIME タイプで示します。
Accept ヘッダーと同様に「タイプ/サブタイプ」の形式で記述することが出来ます。

（例）テキスト(HTML)形式であることを表しています。

```
Content-Type: text/html

※文字コードも設定することが出来る。(charsetは省略可能だが、textタイプのデフォルト文字エンコーディングはISO8859-1のため文字化けを引き起こす可能性がある。)
Content-Type: text/html; charset=utf-8
```

### User-agent

リクエスト送信時に設定するパラメーター。
ブラウザや Bot などのユーザー情報をサーバーに伝えるために使用される。

（例）

```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
```

### Accept

リクエスト送信時に設定するパラメーター。
ブラウザが受信可能なデータ形式(メディアタイプ)をサーバに伝えるために使用される。
Content-Type ヘッダーと同様に「タイプ/サブタイプ」の形式で記述することが出来ます。
メディアタイプを複数指定することが可能で、表示するメディアタイプに優先度を付けたい場合には、セミコロンで区切り「q=」で表す品質係数を加えます。品質係数は 0~1 の範囲ので、1 の方が高くなります。

（例）

```
Accept: text/html; q=1.0, text/*; q=0.8, image/gif, image/jpeg; q=0.6
```

### Referer

リクエスト送信時に設定するパラメーター。
リクエストが発生した元のリソースの URI を伝えるために使用されます。

（例）

```
Referer: http://www.example.com/index.html
```

### Accept-Encoding

リクエスト送信時に設定するパラメーター。
ブラウザが受信可能なエンコード方式をサーバーに伝えるために使用されます。
Accept ヘッダー同様、複数エンコーディングの指定や品質係数を用いて優先度を付けることが出来ます。

（例）

```
Accept-Encoding: gzip, deflate
```

### Authorization

リクエスト送信時に設定するパラメーター。
HTTP で規定されている認証方式である Basic/Digest/OAuth 認証などを行う際に、認証情報をサーバーに伝えるために使用されます。
RFC では標準的な形式として、Basic/Digest/Bearer などがある。

（例）

```
Authorization: Basic dGFuYWthOmhpbWl0c3U=
```

参考: https://qiita.com/uasi/items/cfb60588daa18c2ec6f5

### Location

レスポンス送信時に設定するパラメーター。
レスポンスの受信者に対して、リクエストした URI 以外のリソースへのアクセスを誘導する場合に使用されます。
基本的には、3XX: Redirection のレスポンスに対して、リダイレクト先の URI を記述します。

（例）http://example.com/index.htmlにアクセスされた時にhttp://example.com/へリダイレクトしたい場合

```
Location: http://example.com/
```

## referer について

### a タグに target="\_blank"を設定したところ、先輩エンジニアから「ちゃんと rel=noreferrer を設定した？」と聞かれました。なぜそのような設定が必要なのでしょうか？

rel 属性に noreferrer を付けることで、参照先に対して参照元のリンクを渡さないようにすることが出来るようになるため、ユーザー ID や token などのセンシティブな情報が URL に含まれていても大丈夫になります。また、元のページを window.opener オブジェクトとして持つので、リンク先のページから window.opener.location = "danger site url" のように元ページを操作することが出来てしまう問題を防ぐことが出来ます。

参考:
https://blog.ojisan.io/noreferrer-noopener
https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer

### rel=noreferrer を設定しなかった場合に起きうる問題を調べて、説明して下さい

- 遷移した先の Web サイトのサーバーにユーザー ID や token などのセンシティブな情報が漏れてしまう。
- 元ページを操作することが出来てしまうため、悪意のあるサイトにリダイレクトされてしまう可能性がある。
- target="\_blank"で開かれたページは、元ページと JavaScript が同じプロセス・スレッドで動作するため、ページ負荷の高い JavaScript が実行されていたりすると元ページのパフォーマンス低下など影響がある。

### 先輩エンジニアに「同じオリジンの時は referer の情報を全部送って、別オリジンの時は、オリジン情報だけを referer として送信するように、HTTP リクエストにヘッダを追加しておいてもらえる？」と頼まれました。HTTP リクエストのヘッダーには、どんな値を追加する必要があるでしょうか？

HTTP ヘッダーに`Referrer-Policy: origin-when-cross-origin` を設定する。

参考:
https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy
https://blog.jxck.io/entries/2018-10-08/referrer-policy.html

## クイズ

### HTTP ヘッダーに関するクイズを 3 問、作成してください

1. Referrer-Policy の設定には HTTP ヘッダーに指定する以外に、どのような設定方法があるでしょうか？
2. Content-type: multipart/form-data とは、どのような役割を行い、どのようなケースで利用されますか？
3. Allow ヘッダーの意味と、役割を説明してください。
