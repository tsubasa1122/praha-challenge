const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ text: 'hello world' });
});

app.post('/', (req, res) => {
  if (req.is('application/json')) {
    res.status(201).json(req.body);
  } else {
    res.status(400);
  }
  res.end();
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
