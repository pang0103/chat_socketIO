CREATE TABLE users(
    user_id INTEGER NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE guests(
    guest_id INTEGER NOT NULL AUTO_INCREMENT,
    guest_name VARCHAR(255) NOT NULL,
    expire_on DATETIME NOT NULL,
    PRIMARY KEY (guest_id)
);
