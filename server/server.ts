import bodyParser from 'body-parser';
import express from 'express';

// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen({port: 3000}, () => {
  console.log('App is listening on port 3000!');
});
