# 作成から30日経ったら安いストレージに移動する

resource "aws_s3_bucket" "s3_test1" {
  bucket = "praha-challenge-s3-test1"
  acl    = "private"

  lifecycle_rule {
    # ルールスコープは設定できない？ -> prefixを設定しないと全体になるらしい
    id      = "images"
    enabled = true

    # 30日後にS3 Glacierに移動する
    transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}

resource "aws_s3_bucket" "s3_test2" {
  bucket = "praha-challenge-s3-test2"
  acl = "private"

  lifecycle_rule {
    # バケット毎にライフサイクルを作成するので、id名が同じでも問題ないみたい
    id = "images"
    enabled = true

    # 90日後に削除する
    expiration {
      days = 90
    }
  }
}