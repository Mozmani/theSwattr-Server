-- linkage
CREATE TABLE app (
  id SERIAL PRIMARY KEY,
  app_name VARCHAR(50)
);
CREATE TABLE bug_app (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  app_id INTEGER REFERENCES app(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, app_id)
);

-- linkage
CREATE TABLE status (
  id SERIAL PRIMARY KEY,
  status_name VARCHAR(10)
);
CREATE TABLE bug_status (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  status_id INTEGER REFERENCES status(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, status_id)
);

-- linkage
CREATE TABLE severity_level (
  id SERIAL PRIMARY KEY,
  level VARCHAR(50)
);
CREATE TABLE bug_severity_level (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  severity_id INTEGER REFERENCES severity_level(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, severity_id)
);

-- seeds
INSERT INTO app (app_name)
VALUES ('Main App');
INSERT INTO bug_app (bug_id, app_id)
VALUES
  (1, 1),
  (2, 1);

INSERT INTO status (status_name)
VALUES
  ('Pending'),
  ('Open'),
  ('Closed'),
  ('Dormant');
INSERT INTO bug_status (bug_id, status_id)
VALUES
  (1, 1),
  (2, 4);

INSERT INTO severity_level (level)
VALUES
  ('Low'),
  ('Medium'),
  ('High');
INSERT INTO bug_severity_level (bug_id, severity_id)
VALUES
  (1, 1),
  (2, 3);
