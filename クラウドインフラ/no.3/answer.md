- プラベートサブネットに EC2 を作成すると書いてあるが、パブリックサブネットでは...?
  - プライベートだった。https://prahachallengeseason1.slack.com/archives/C01HY1BA5LG/p1623719384028700
  - NAT ゲートウェイを使って Nginx をインストールした
  - https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html

## Nginx を導入する

apt-key がないと怒られた

```shell
$ cat /etc/os-release
NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"
```

CentOS だからっぽい
公式に Amazon Linux の Installation 書いてあった
http://nginx.org/en/linux_packages.html

インストールする Nginx の設定値を入れる

```shell
$ sudo vi /etc/yum.repos.d/nginx.repo
```

Nginx はとりあえず安定版を入れた

```
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/amzn2/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

インストール

```shell
$ sudo yum install nginx
```

サーバーが立ち上がったら、毎回 Nginx を立ち上げるように

```shell
$ sudo systemctl enable nginx
```

公式を見ながら Install 後、Nginx を立ち上げてみる

```shell
$ systemctl start nginx
```

ブラウザからアクセスしてみる。良さそう
![スクリーンショット](images/start_nginx.png)

[ここ](https://www.nginx.com/blog/setting-up-nginx/#web-server)を参考に html を返すようにした

```shell
$ sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.back
$ sudo vi /home/public.html
$ sudo vi /etc/nginx/conf.d/server.conf
$ sudo nginx -s reload
```

### 参考

https://www.nginx.com/blog/setting-up-nginx/  
https://webplus8.com/aws-amazon-linux-os-version/  
https://weblabo.oscasierra.net/nginx-centos7-install/

- Nginx の location の設定
  http://www2.matsue-ct.ac.jp/home/kanayama/text/nginx/node36.html

### メモ

- ALB のヘルスチェックはどんな観点を基準に設定したらいいんだろう？
- 毎回 GUI でポチポチ環境構築するのシンドイ...
- いずれかのパブリックサブネットに ALB（アプリケーションロードバランサー）を設置してと書いてあるが、ALB は サブネットを指定して作成できる？
- ターゲットグループの設定で、root 以外のパスを指定することはできるのかな？
