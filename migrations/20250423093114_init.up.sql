CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username TEXT UNIQUE NOT NULL,
                       password TEXT NOT NULL

);

CREATE TABLE categories (
                            id SERIAL PRIMARY KEY,
                            name TEXT NOT NULL
);

CREATE TABLE news (
                      id SERIAL PRIMARY KEY,
                      title TEXT NOT NULL,
                      content TEXT NOT NULL,
                      category_id INT REFERENCES categories(id)
);
ALTER TABLE news ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE news ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

