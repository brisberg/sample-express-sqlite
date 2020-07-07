import bodyParser from 'body-parser';
import express from 'express';
import * as Database from './db';

// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = Database.connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/list', (req, res) => {
  const todos: unknown[] = [];
  db.all(`SELECT rowid, label, done FROM todos`, (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    todos.push(rows);
    res.send({todos: rows});
  });
});

app.post('/new', (req, res) => {
  const {label} = req.body;

  // insert one row into the todos table
  const sql = `INSERT INTO todos(label, done) VALUES(?, ?)`;
  db.run(sql, [label, false], function(err) {
    if (err) {
      console.log(err.message);
      res.status(500).send({error: err.message});
      return;
    }
    // eslint-disable-next-line no-invalid-this
    const lastID = this.lastID;
    // get the last insert id
    console.log(`A row has been inserted with rowid ${lastID}`);
    res.send({newId: lastID});
  });
});

app.post('/delete', (req, res) => {
  const {id} = req.body;
  const sql = 'DELETE FROM todos WHERE rowid = ?';
  db.run(sql, id, (err) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({error: err.message});
      return;
    }
    res.send(`Todo ${id} deleted successfully.`);
  });
});

app.listen({port: 3000}, () => {
  console.log('App is listening on port 3000!');
});

process.on('exit', () => {
  Database.close();
});
