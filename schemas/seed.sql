DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE `departments` (
	`id` INT AUTO_INCREMENT,
    `name` VARCHAR(30),
	PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
	`id` INT AUTO_INCREMENT,
    `title` VARCHAR(35),
    `salary` DECIMAL,
    `department_id` INT,
    PRIMARY KEY (`id`)
);

CREATE TABLE `employees` (
	`id` INT AUTO_INCREMENT,
    `first_name` VARCHAR(30),
    `last_name` VARCHAR(30),
    `role_id` INT,
    `manager_id` INT,
    PRIMARY KEY (`id`)
);

INSERT INTO departments (name)
    VALUES ("Management"),("Sales");

INSERT INTO roles (title, salary, department_id)
    VALUES ("Manager", 60000, 1), ("Salesperson", 70000, 2), ("Assistant Regional Manager", 60000, 1), ("Assistant to the Regional Manager", 30000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ("Michael", "Scott", 1, NULL), ("Jim", "Halpert", 3, 1), ("Dwight", "Schrute", 4, 1);