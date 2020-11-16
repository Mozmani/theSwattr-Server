DROP TABLE IF EXISTS severity_level;

CREATE TABLE severity_level (
  id SERIAL PRIMARY KEY,
  level VARCHAR(50)
);
