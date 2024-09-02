terraform {
  backend "s3" {
    bucket         = "rental-source-bucket"
    key            = "state/terraform.tfstate"
    region         = "eu-west-1"
encrypt = true
  }
}