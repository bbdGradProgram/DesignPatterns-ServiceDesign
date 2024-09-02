
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.project_name}-docker-image-1400"
 tags   = merge(var.mandatory_tags, { Name = "${var.project_name}-docker-image-1400" })
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  tags                 = merge(var.mandatory_tags, { Name = "${var.project_name}-vpc" })
}

resource "aws_subnet" "public_subnets" {
  count             = length(var.vpc_public_subnets)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.vpc_public_subnets[count.index].cidr_block
  tags              = merge(var.mandatory_tags, { Name = "${var.project_name}-public-subnet-${count.index}" })
  availability_zone = var.vpc_public_subnets[count.index].az
}

resource "aws_subnet" "private_subnets" {
  count             = length(var.vpc_private_subnets)
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.vpc_private_subnets[count.index].cidr_block
  availability_zone = var.vpc_private_subnets[count.index].az
  tags              = merge(var.mandatory_tags, { Name = "${var.project_name}-private-subnet-${count.index}" })
}

# Internet Gateway
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags   = merge(var.mandatory_tags, { Name = "${var.project_name}-internet-gateway" })
}

# Routing table
resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-route-table" })
}

# Resource association table
resource "aws_route_table_association" "route_table_association" {
  count          = length(aws_subnet.public_subnets)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.route_table.id
}

# NAT Gateway Elastic IP
resource "aws_eip" "nat_eip" {
  domain = "vpc"
}

# NAT Gateway
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnets[0].id
  tags          = merge(var.mandatory_tags, { Name = "${var.project_name}-nat-gateway" })
}

# Private Routing table
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }
  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-private-route-table" })
}

# Associate private subnets with the private route table
resource "aws_route_table_association" "private_route_table_association" {
  count          = length(aws_subnet.private_subnets)
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_route_table.id
}

#Check this
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.project_name}-subnet-group"
  subnet_ids = aws_subnet.public_subnets[*].id
  tags       = merge(var.mandatory_tags, { Name = "${var.project_name}-public-subnet-group" })
}

resource "aws_db_instance" "db" {
  identifier                  = "${var.project_name}-db"
  allocated_storage           = 20
  engine                      = "sqlserver-ex"
  engine_version              = "16.00.4095.4.v1"
  instance_class              = "db.t3.micro"
  publicly_accessible         = true
  username                    = "admin"
  multi_az                    = false # Free tier supports only single AZ
  manage_master_user_password = true  #Fetch password from console
  apply_immediately           = true
  copy_tags_to_snapshot       = true
  db_subnet_group_name        = aws_db_subnet_group.db_subnet_group.name
  skip_final_snapshot         = true

  vpc_security_group_ids = [
    aws_security_group.db_security_group.id
  ]
  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-db" })
}

resource "aws_elastic_beanstalk_application" "backend_app" {
  name        = "${var.project_name}-backend-app"
  description = "Beanstalk application"
}

resource "aws_elastic_beanstalk_environment" "backend_env" {
  name                = "${var.project_name}-backend-env"
  application         = aws_elastic_beanstalk_application.backend_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.3 running Docker"
  cname_prefix        = "${var.project_name}-backend"

setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = true
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.vpc.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.private_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", aws_subnet.public_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }
  # setting {
  #   namespace = "aws:ec2:vpc"
  #   name      = "AssociatePublicIpAddress"
  #   value     = true
  # }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "2"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "IdleTimeout"
    value     = "60"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.ec2_instance_profile.name
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_web.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }

 setting {
   namespace = "aws:elbv2:listener:443"
    name      = "Protocol"
    value     = "HTTPS"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "ListenerEnabled"
    value     = "true"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "DefaultProcess"
    value     = "default"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "Protocol"
    value     = "HTTP"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "ListenerEnabled"
    value     = "true"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_lb.id
  }

 setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = "arn:aws:acm:eu-west-1:774089569115:certificate/622882e7-86e1-450e-b740-6dba0e1c4875" # Replace with your SSL certificate ARN
  }

  # Optional: redirect HTTP to HTTPS
  # setting {
  #   namespace = "aws:elbv2:listener:80"
  #   name      = "Rules"
  #   value     = "path-pattern / -> forward: 443, path-pattern /* -> redirect: https://rudolph-sucks.projects.bbdgrad.com#{path}?#{query}"
  # }
}

resource "aws_elastic_beanstalk_application" "frontend_app" {
  name        = "${var.project_name}-frontend-app"
  description = "Beanstalk application"
}

resource "aws_elastic_beanstalk_environment" "frontend_env" {
  name                = "${var.project_name}-frontend-env"
  application         = aws_elastic_beanstalk_application.frontend_app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.3 running Docker"
  cname_prefix        = "${var.project_name}-frontend"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.vpc.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.private_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", aws_subnet.public_subnets[*].id)
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t3.micro"
  }
  # setting {
  #   namespace = "aws:ec2:vpc"
  #   name      = "AssociatePublicIpAddress"
  #   value     = true
  # }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "2"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "IdleTimeout"
    value     = "60"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.ec2_instance_profile.name
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_web.id
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "basic"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "Protocol"
    value     = "HTTPS"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "ListenerEnabled"
    value     = "true"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "DefaultProcess"
    value     = "default"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "Protocol"
    value     = "HTTP"
  }

  setting {
    namespace = "aws:elbv2:listener:80"
    name      = "ListenerEnabled"
    value     = "true"
  }

  setting {
    namespace = "aws:elbv2:loadbalancer"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_security_group_lb.id
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = "arn:aws:acm:eu-west-1:774089569115:certificate/622882e7-86e1-450e-b740-6dba0e1c4875" # Replace with your SSL certificate ARN
  }
}


//resource "aws_apigatewayv2_api" "api" {
 // name          = "${var.project_name}-service-api"
 // description   = "API Gateway for the service endpoints"
 // protocol_type = "HTTP"

//}


//resource "aws_apigatewayv2_domain_name" "api" {
//  domain_name = "api.rentals.projects.bbdgrad.com"


 // domain_name_configuration {
  //  certificate_arn = "arn:aws:acm:eu-west-1:774089569115:certificate/622882e7-86e1-450e-b740-6dba0e1c4875"
 //   endpoint_type   = "REGIONAL"
 //   security_policy = "TLS_1_2"
//  }


 // mutual_tls_authentication {
  //  truststore_uri = "s3://miniconomy-trust-store-bucket/truststore.pem"
 // }
//}
//resource "aws_apigatewayv2_stage" "default" {
 // api_id      = aws_apigatewayv2_api.api.id
 // name        = "$default"
 // auto_deploy = true
//}


//resource "aws_apigatewayv2_api_mapping" "api" {
  //api_id      = aws_apigatewayv2_api.api.id
  //domain_name = aws_apigatewayv2_domain_name.api.domain_name
 // stage       = aws_apigatewayv2_stage.default.id
//}

resource "aws_lb" "oauth_lb" {
  name               = "${var.project_name}-oauth-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.db_security_group.id]
  subnets            = [ aws_subnet.public_subnets[0].id,  aws_subnet.public_subnets[1].id]

   tags = merge(var.mandatory_tags, { Name = "${var.project_name}-oauth-lb" })
}

resource "aws_lb" "api_lb" {
  name               = "${var.project_name}-api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.db_security_group.id]
  subnets            = [ aws_subnet.public_subnets[0].id,  aws_subnet.public_subnets[1].id]

  tags = merge(var.mandatory_tags, { Name = "${var.project_name}-api_lb" })
}

resource "aws_lb_target_group" "oauth_tg" {
  name        = "${var.project_name}-oauth-tg"
  port        = 443
  protocol    = "HTTPS"
  vpc_id      = aws_vpc.vpc.id
  target_type = "instance"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    protocol            = "HTTPS"
  }

   tags = merge(var.mandatory_tags, { Name = "${var.project_name}-oauth_tg" })
}

resource "aws_lb_target_group" "api_tg" {
  name        = "${var.project_name}-api-tg"
  port        = 444
  protocol    = "HTTPS"
  vpc_id      = aws_vpc.vpc.id
  target_type = "instance"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    protocol            = "HTTPS"
  }
 tags = merge(var.mandatory_tags, { Name = "${var.project_name}-api_tg" })
}

resource "aws_lb_listener" "oauth_listener" {
  load_balancer_arn = aws_lb.oauth_lb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:eu-west-1:774089569115:certificate/f6677ee9-1ebb-4fce-a7e1-1b760e1a23ff" # Replace with your certificate ARN

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.oauth_tg.arn
  }
}

resource "aws_lb_listener" "api_listener" {
  load_balancer_arn = aws_lb.api_lb.arn
  port              = 444
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:eu-west-1:774089569115:certificate/622882e7-86e1-450e-b740-6dba0e1c4875" # Replace with your certificate ARN

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}

resource "aws_lb_target_group_attachment" "oauth_tg_attachment" {
  count            = length(var.instance_ids)
  target_group_arn = aws_lb_target_group.oauth_tg.arn
  target_id        = var.instance_ids[count.index]
  port             = 80
}

resource "aws_lb_target_group_attachment" "api_tg_attachment" {
  count            = length(var.instance_ids)
  target_group_arn = aws_lb_target_group.api_tg.arn
  target_id        = var.instance_ids[count.index]
  port             = 80
}


//resource "aws_lb" "example" {
 // name               = "${var.project_name}-target-group"
 // internal           = false
 // load_balancer_type = "application"
  //security_groups    = [ aws_security_group.db_security_group.id]
//subnets            = [ aws_subnet.public_subnets[0].id,  aws_subnet.public_subnets[1].id]
//}


//resource "aws_lb_target_group" "example" {
  //name     = "${var.project_name}-tg"
  // port     = 80
  //protocol = "HTTP"
 // vpc_id   = aws_vpc.vpc.id


 // health_check {
   // path                = "/"
   // protocol            = "HTTP"
  //  port                = "traffic-port"
  //  interval            = 30
   // timeout             = 5
   // healthy_threshold   = 5
   // unhealthy_threshold = 2
   // matcher             = "200-299"
 // }
//}


#resource "aws_lb_listener" "example" {
  #load_balancer_arn = "arn:aws:elasticloadbalancing:eu-west-1:774089569115:loadbalancer/app/awseb--AWSEB-dAxthsN7TnA1/d83163d523bbda24"
  #port              = "443"
  #protocol          = "HTTPS"
  #ssl_policy        = "ELBSecurityPolicy-2016-08"
  #certificate_arn   = "arn:aws:acm:eu-west-1:774089569115:certificate/622882e7-86e1-450e-b740-6dba0e1c4875"

  #default_action {
    #type             = "forward"
   # target_group_arn = aws_lb_target_group.example.arn
  #}

  #mutual_authentication {
    #mode            = "verify"
   # trust_store_arn = "arn:aws:elasticloadbalancing:eu-west-1:774089569115:truststore/RP-TrustStore/1836a0d261af40d5"
  #}
#}