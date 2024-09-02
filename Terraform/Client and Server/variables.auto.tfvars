mandatory_tags = {
  owner         = "duncanb@bbd.co.za"
  created-using = "terraform"
}

account_number = "774089569115"
#create the be cert
backend_certificate = "622882e7-86e1-450e-b740-6dba0e1c4875"
frontend_certificate = "27a73226-f3a6-44ed-b932-e4e4b3f6f6c7"

repo = "hleketaniDuncan97/RealEstateAgent-Rental"

region = "eu-west-1"
project_name = "property-rental"

vpc_public_subnets = [
  {
    cidr_block = "15.0.1.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.3.0/24"
    az         = "eu-west-1b"
}]

vpc_private_subnets = [
  {
    cidr_block = "15.0.5.0/24"
    az         = "eu-west-1a"
  },
  {
    cidr_block = "15.0.7.0/24"
    az         = "eu-west-1b"
}]

db_port = 1433

eb_port_web = 80

