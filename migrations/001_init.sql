CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at INTEGER NOT NULL,
    unit TEXT NOT NULL,
    amount INTEGER NOT NULL,
    payment_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('UNPAID', 'PAID', 'CANCELLED')) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_requests (
    id TEXT PRIMARY KEY,
    unit TEXT NOT NULL,
    transport JSONB NOT NULL,
    amount INTEGER NOT NULL,
    mint TEXT NOT NULL,
    description TEXT NOT NULL,
    lock TEXT 
);


INSERT INTO schema_version (version) VALUES (1);
