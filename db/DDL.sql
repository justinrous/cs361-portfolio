SET FOREIGN_KEY_CHECKS = 0;



CREATE TABLE IF NOT EXISTS users (
    id int AUTO_INCREMENT NOT NULL,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL, 
    email varchar(50) NOT NULL unique, 
    password varchar(100) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS holdings (
    userId int NOT NULL, 
    ticker varchar(20) NOT NULL unique, 
    quantity DECIMAL(10,2) NOT NULL, 
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS watchList (
    userId int NOT NULL, 
    ticker varchar(20) NOT NULL unique, 
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stockPrices (
    ticker VARCHAR(20) NOT NULL,
    stockDate DATE NOT NULL, 
    openPrice decimal(15, 2) NOT NULL, 
    highPrice decimal(15, 2) NOT NULL, 
    lowPrice decimal(15, 2) NOT NULL, 
    closePrice decimal(15, 2) NOT NULL, 
    volume decimal(15, 2) NOT NULL, 
    PRIMARY KEY (ticker, stockDate)
);

SET FOREIGN_KEY_CHECKS = 1;