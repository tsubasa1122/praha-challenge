### 課題１

**プライベートサブネットとパブリックサブネットの違い**

- パブリックサブネットはインターネットと通信出来るサブネットのことで、プライベートサブネットはインターネットと通信出来ないサブネットのこと。

参考:  
https://ex-ture.com/blog/2021/07/14/publicsubnet-vs-plivatesubnet/

**VPC をマルチ AZ で構築する**

- IP アドレスはどうやって決めてけば良いだろう？

  - CIDR について https://dev.classmethod.jp/articles/what-is-cidr/
  - VPC にサブネットを追加したらルートテーブルの設定も確認する
    - 今回だと public subnet を追加した際に、インターネットへ出ていくルート設定がなかった

**パブリックサブネットの EC2 インスタンスからのみプライベートサブネットの EC ２インスタンスに SSH でアクセスできるようにする**

- scp を使って、pem ファイルをパブリックサブネットの EC2 インスタンスに配置した
  - ブリックサブネットの EC2 インスタンスが踏み台サーバーの役割になる
