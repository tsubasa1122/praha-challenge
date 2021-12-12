terraform {
  required_version = ">= 0.12"
}

provider "aws" {
  region = var.provider_region
}

provider "aws" {
  alias  = "us"
  region = var.provider_region_us
}