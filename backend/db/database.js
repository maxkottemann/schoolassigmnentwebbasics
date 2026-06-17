const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "guitarrig.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("foreign_keys = ON");
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS artists (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      genre       TEXT,
      bio         TEXT,
      image_url   TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gear (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      brand       TEXT NOT NULL,
      type        TEXT NOT NULL CHECK(type IN ('gitaar', 'versterker', 'pedaal', 'snaren', 'overig')),
      description TEXT,
      image_url   TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rigs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      artist_id   INTEGER NOT NULL,
      gear_id     INTEGER NOT NULL,
      note        TEXT,
      created_at  TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
      FOREIGN KEY (gear_id)   REFERENCES gear(id)    ON DELETE CASCADE,
      UNIQUE(artist_id, gear_id)
    );
  `);
}

module.exports = { getDb, initDb };
