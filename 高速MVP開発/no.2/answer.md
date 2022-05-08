# 課題 1（実装）

**フロント側のログイン機能**

- https://github.com/tsubasa1122/firebase-authentication-app/pull/1
  - フロントは firebaseui-web-react を使った
  - https://github.com/firebase/firebaseui-web-react
    - react18 だとうまく動かない問題に気づくまでに時間が掛かった

**バック側の認可機能**

- https://github.com/tsubasa1122/praha-challenge-ddd/pull/9

### 参考

https://qiita.com/gagagaga_dev/items/a8dd490114c315329279  
https://maku.blog/p/8t6gq2b/  
https://firebase.google.com/docs/admin/setup  
https://firebase.google.com/docs/auth/admin/verify-id-tokens#web  
https://future-architect.github.io/articles/20200819/

# 課題 2（質問）

**アクセストークンではなく、Cookie を用いる状況**

- ブラウザ経由で、同一ドメインのバックエンドへリクエストを送るアプリケーションの場合は Cookie を用いる
  - Cookie の方が、よりセキュアな仕組みが備わっている
    - Secure 属性や httpOnly 属性など
    - アクセストークもセッション id も用途はユーザーを特定するものなので、基本的には Cookie 経由でやりとりした方が安全
  - mobile や外部サービスと連携する際には、Cookie 経由で情報のやり取りができないため、アクセストークをリクエストの header(Authorization header とか)に追加してやり取りを行う

**アクセストークンが盗まれた場合の対応**

- トークンを無効化する
  - firebase だとこの辺り https://firebase.google.com/docs/auth/admin/manage-sessions?hl=ja
  - リフレッシュトークンが盗まれている場合もあるため、リフレッシュトークンを優先的に無効化する方が良さそう
  - 最近起こったセキュリティの事故だと、GitHub の OAuth トークンが盗まれることがあった
    - https://project.nikkeibp.co.jp/idg/atcl/19/00002/00333/
    - 実際は、Heroku が不正アクセスされて、そこからトークンが盗まれてしまった
    - GitHub 上で連携を解除することでトークンを無効化する対応を行った
