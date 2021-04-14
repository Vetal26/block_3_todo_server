const express = require('express');

const config = require('./config.json')[process.env.NODE_ENV];
const cors = require('cors');
const route = require('./route');
const app = express();

app.use(cors());

app.use('/', route);

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function(req, res) {
  res.status(404).send('PAGE NOT FOUND!');
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});