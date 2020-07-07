import bodyParser from 'body-parser';
import express from 'express';
import sqlite3 from 'sqlite3';
sqlite3.verbose();  // Enable long stack traces

// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = new sqlite3.Database('./db/default.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    label TEXT NOT NULL,
    done BOOLEAN DEFAULT false
  );
  `);

  // db.run(`INSERT INTO todos(label, done)
  //         VALUES ('Test TODO', false),
  //                ('Test TODO 2', true),
  //                ('Test TODO 3', false)
  // `);

  db.each(`SELECT rowid, label, done FROM todos`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(JSON.stringify(row));
  });
});

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen({port: 3000}, () => {
  console.log('App is listening on port 3000!');
});
