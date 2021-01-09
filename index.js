const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/data/covid-19.json', function (req, res) {
  res.sendFile(path.join(__dirname + '/data/covid-19.json'));
});

app.use('/', router);
app.listen(8000);

console.log('Open http://localhost:8000 in a browser.');