-- Bamazon schema
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT auto_increment,
    item VARCHAR(30),
    department VARCHAR(30),
    price DEC(10,2),
    stock INT,
    primary key(item_id)
);