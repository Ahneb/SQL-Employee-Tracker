drop database if exists employee_db;
create database employee_db;

use employee_db;

create table departments (
  id int AUTO_INCREMENT not null,
  name varchar(30),
  primary key(id)
);

create table roles (
  id int AUTO_INCREMENT not null,
  title varchar(30) not null,
  salary decimal not null,
  department_id int not null,
  primary key(id),
  foreign key (department_id) references departments(id)
);

create table employee (
  id int AUTO_INCREMENT not null,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id int not null,
  manager_id int,
  
  primary key(id),
  foreign key (role_id) references roles(id),
  foreign key (manager_id) references employee(id)
);