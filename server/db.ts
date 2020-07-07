
import sqlite3 from 'sqlite3';
sqlite3.verbose();  // Enable long stack traces

export const DEFAULT_DATABASE = './db/default.db';
let db: sqlite3.Database;

/** Connects to the filesystem database at the specified path. */
export function connect(dbPath = DEFAULT_DATABASE): sqlite3.Database {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
  return db;
}

/**
 * Initializes Database Schema
 *
 * Creates all missing tables.
 */
export function initialize(): void {
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      label VARCHAR(100) NOT NULL,
      done BOOLEAN DEFAULT false
    );
    `);
  });
}

/** Closes the Database Connection */
export function close(): void {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// Examples
// db.run(`INSERT INTO todos(label, done)
//         VALUES ('Test TODO', false),
//                ('Test TODO 2', true),
//                ('Test TODO 3', false)
// `);

// db.each(`SELECT rowid, label, done FROM todos`, (err, row) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log(JSON.stringify(row));
// });
