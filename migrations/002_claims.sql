CREATE TABLE IF NOT EXISTS claims (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at INTEGER NOT NULL,
  proof JSONB NOT NULL,
  payment_id TEXT NOT NULL
  );

INSERT INTO schema_version (version) VALUES (2);
