resource "aws_s3_bucket" "s3_test" {
  bucket = "praha-challenge-s3-test"
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
  # アクセスコントロールをパブリックにしてもオブジェクトへアクセスできないのはなんでだろう？
  # acl    = "public-read"
}

# S3 Bucket Policy https://katsuya-place.com/terraform-s3-public-access/
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    sid    = ""
    effect = "Allow"

    ## アクセス元の設定。
    principals {
      identifiers = ["*"] ## 誰でもアクセスできるように設定。
      type        = "*"
    }

    ## バケットに対して制御するアクションを設定する。
    actions = [
      "s3:GetObject" ## オブジェクトの読み取りアクション。
    ]

    ## アクセス先の設定。
    resources = [
      "arn:aws:s3:::praha-challenge-s3-test",  ## praha-challenge-s3-testバケットへのアクセス。
      "arn:aws:s3:::praha-challenge-s3-test/*" ## praha-challenge-s3-testバケット配下へのアクセス。
    ]
  }
}