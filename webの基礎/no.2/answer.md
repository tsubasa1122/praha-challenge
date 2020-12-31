## 問題 1

```
curl 'https://httpbin.org/headers' -H 'X-Test: hello'
```

## 問題 2

```
curl -X POST 'https://httpbin.org/post' -H 'Content-Type: application/json' -d '{"name": "hoge"}'
```

## 問題 3

```
curl -X POST 'https://httpbin.org/post' -H 'Content-Type: application/json' -d '{"userA": {"name": "hoge", "age": 29}}'
```

## 問題 4

```
curl -X POST 'https://httpbin.org/post' -H 'Content-Type: application/x-www-form-urlencoded' -d '{"name": "hoge"}'
```

## クイズ

### curl に関するクイズを作成してください

1. 'https://httpbin.org/get' のヘッダー情報のみを curl コマンドを用いて取得しなさい。
   下記のようなレスポンスが返ってくるはずです。

```
HTTP/2 200
date: Wed, 30 Dec 2020 06:36:50 GMT
content-type: application/json
content-length: 255
server: gunicorn/19.9.0
access-control-allow-origin: *
access-control-allow-credentials: true
```

2. curl コマンドでリクエストした時のヘッダー情報を確認したい時のオプションはなんでしょうか？

3. 'https://httpbin.org/json' のレスポンスから title のデータだけを抜き出してください。
   以下のようなレスポンスを抽出します。

```
 "title": "Wake up to WonderWidgets!",
 "title": "Overview",
"title": "Sample Slide Show"
```

### postman に関するクイズを作成してください

1. postman を用いて、'https://httpbin.org/basic-auth/user/password' の url の Basic 認証を通してください。(ユーザー ID: user パスワード: password)
   以下のようなレスポンスが返ってきます。

```
{
  "authenticated": true,
  "user": "user"
}

```

2. postman で設定できる Environment 変数は、どのような時に利用されるでしょうか？
3. Import 機能とはどのような機能でしょうか？また、Google Chrome の Copy as cURL 機能を用いて、'https://httpbin.org/json' の URL へのリクエストを Import して postman 経由で叩いてみてください。
   Copy as cURL 機能のやり方: https://tech.withsin.net/2018/02/02/chrome-copy-as-curl/
