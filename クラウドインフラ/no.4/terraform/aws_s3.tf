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
  acl    = "private"

  lifecycle_rule {
    # バケット毎にライフサイクルを作成するので、id名が同じでも問題ないみたい
    id      = "images"
    enabled = true

    # 90日後に削除する
    expiration {
      days = 90
    }
  }
}

resource "aws_s3_bucket" "s3_test3" {
  bucket = "praha-challenge-s3-test3"
  acl    = "private"
  force_destroy = true

  # レプリケーションを設定する場合、バージョニングの設定は必須
  versioning {
    enabled = true
  }

  replication_configuration {
    role = aws_iam_role.replication.arn
    rules {
      id     = "foobar"
      status = "Enabled"
      destination {
        bucket = aws_s3_bucket.s3_test3_destination.arn
      }
    }
  }
}

# レプリケーション先のバケット
resource "aws_s3_bucket" "s3_test3_destination" {
  provider      = aws.us
  bucket        = "praha-challenge-s3-test3-destination"
  acl           = "private"
  force_destroy = true

  # レプリケーションを設定する場合、バージョニングの設定は必須
  versioning {
    enabled = true
  }
}

resource "aws_iam_role" "replication" {
  name = "tf-iam-role-replication-12345"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "replication" {
  name = "tf-iam-role-policy-replication-12345"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetReplicationConfiguration",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.s3_test3.arn}"
      ]
    },
    {
      "Action": [
        "s3:GetObjectVersionForReplication",
        "s3:GetObjectVersionAcl",
        "s3:GetObjectVersionTagging"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.s3_test3.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete",
        "s3:ReplicateTags"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.s3_test3_destination.arn}/*"
}
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "replication" {
  role       = aws_iam_role.replication.name
  policy_arn = aws_iam_policy.replication.arn
}