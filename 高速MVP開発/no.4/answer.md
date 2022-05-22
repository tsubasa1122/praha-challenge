※ 誤って main で作業してしまったため、コミットの URL を記載しています :pray:

**airtable にデータを登録する API を作成**

- 該当コミット
  - https://github.com/tsubasa1122/airtable-api-typescript/commit/4fb6eb78cd2183df3ecb77387d12ba96101f4954
- 下記のような形式のデータを POST すると Airtable にデータが登録される

```
$ curl -v -X POST 'localhost:8000/users' -H 'content-type: application/json' --data '{ "users": [ {"name": "taro", "age": 20} ] }'
```

**airtable に登録されたデータ一覧を取得する API を作成**

- 該当コミット
  - https://github.com/tsubasa1122/airtable-api-typescript/commit/9c397c70fe4bc32ad2d14ebe432831a8f0155b69
- 下記のようなリクエストを送るとデータの一覧を取得することができる

```
$ curl 'localhost:8000/users' -H 'content-type: application/json' | jq

[
  {
    "name": "taro",
    "age": 20,
    "id": "cvhKgxskaIZKxHMSF"
  }
]
```
