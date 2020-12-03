BEGIN;

TRUNCATE users, status, app, severity_level RESTART IDENTITY CASCADE;

COMMIT;