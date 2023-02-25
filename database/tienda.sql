CREATE DATABASE IF NOT EXIST tiendadb;

CREATE TABLE programacion (
	id INT PRIMARY KEY auto_increment,
	titulo VARCHAR(50) NOT NULL,
	lenguaje VARCHAR(20) NOT NULL,
	vistas INT,
	nivel VARCHAR(20) NOT NULL 
);
CREATE TABLE matematicas (
	id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
	tema VARCHAR(20) NOT NULL,
	vistas INT,
	nivel VARCHAR(20) NOT NULL 
);

