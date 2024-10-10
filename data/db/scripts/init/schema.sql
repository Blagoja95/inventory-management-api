CREATE TABLE IF NOT EXISTS measurements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    symbol VARCHAR(25) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
    id varchar(12) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC DEFAULT 0,
    measurement_id INT NOT NULL,
    price NUMERIC DEFAULT 0.00,
    description TEXT,
    FOREIGN KEY (measurement_id) REFERENCES measurements(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    article_id varchar(12) NOT NULL,
    mode SMALLINT NOT NULL,
    Quantity NUMERIC NOT NULL,
    Price NUMERIC NOT NULL,
    Date DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);
