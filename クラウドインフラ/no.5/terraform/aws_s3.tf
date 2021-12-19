resource "aws_s3_bucket" "s3_test1" {
  bucket = "praha-challenge-s3-test1"
  acl    = "private"
}
