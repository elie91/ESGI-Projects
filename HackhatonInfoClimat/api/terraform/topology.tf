resource "aws_elastic_beanstalk_application" "sportunities" {
  name        = "tf-test-name"
  description = "tf-test-desc"
}

resource "aws_elastic_beanstalk_environment" "sportunities-env" {
  name                = "tf-test-name"
  application         = aws_elastic_beanstalk_application.sportunities.name
  solution_stack_name = "64bit Amazon Linux 2018.03 v2.26.0 running Multi-container Docker 19.03.13-ce (Generic)"
}

resource "aws_security_group" "allow_tls" {
  name        = "sportunities"
  description = "Allow TLS inbound traffic"
  vpc_id      = 'vpc-2bd41343'

  ingress {
    description      = "TLS from VPC"
    from_port        = 5432
    to_port          = 6379
    protocol         = "tcp"
    security_groups = [aws_security_group.allow_tls]
  }

  tags = {
    Name = "allow_tls"
  }
}

resource "aws_db_instance" "db" {
  allocated_storage    = 10
  engine               = "postgres"
  instance_class       = "db.t2.micro"
  name                 = "db.t2.micro"
  username             = "postgres"
  password             = "postgrespassword"
  skip_final_snapshot  = true
  security_group_names = [aws_security_group.allow_tls]
}
