CREATE DATABASE IF NOT EXISTS kluh;
USE kluh;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DOUBLE NOT NULL,
    quantity INT NOT NULL
);

INSERT INTO products (name, description, price, quantity) VALUES
('Laptop', 'Dell XPS 13', 1200.0, 10),
('Smartphone', 'Samsung Galaxy S21', 999.0, 20),
('Tablet', 'Apple iPad Pro', 799.0, 15);