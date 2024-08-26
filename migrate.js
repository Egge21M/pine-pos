const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const client = new Client();
client.c;
console.log(process.env);

function getMigrationFiles() {
  return fs
    .readdirSync(path.join(__dirname, "migrations"))
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function getSchemaVersion() {
  try {
    const res = await client.query("SELECT version FROM schema_version");
    if (res.rows.length < 1) {
      return 0;
    }
    return res.rows[0].version;
  } catch (e) {
    return 0;
  }
}

async function applyMigrations() {
  await client.connect();
  const currentVersion = await getSchemaVersion();
  const migrationFiles = getMigrationFiles();

  await client.query("BEGIN");

  try {
    for (let i = 0; i < migrationFiles.length; i++) {
      const version = parseInt(migrationFiles[i].split("_")[0], 10);
      if (version > currentVersion) {
        const migration = fs.readFileSync(
          path.join(__dirname, "migrations", migrationFiles[i]),
          "utf-8",
        );
        await client.query(migration);
        console.log(`Applied migration: ${migrationFiles[i]}`);
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    console.error("Migration failed:", err);
    client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

applyMigrations();
