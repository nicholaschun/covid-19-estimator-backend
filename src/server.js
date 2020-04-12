const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

require('body-parser-xml')(bodyParser);

const covid19ImpactEstimator = require('./estimator');

const app = express();
const port = process.env.PORT || 3000;
const hostname = '127.0.0.1';

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.xml({ type: 'text/xml' }));
const morganFormat = ':method \t :url \t :status \t  :response-time ms';
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), {
  flags: 'a'
});

app.use(morgan(morganFormat, { stream: accessLogStream }));

const getData = (data) => covid19ImpactEstimator(data);

app.get('/', (req, res) => {
  res.send('Covid-19 estimator api');
});

app.post('/api/v1/on-covid-19', (req, res) => {
  res.json(getData(req.body));
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.send(getData(req.body));
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  res.json(getData(req.body));
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const readStream = fs.createReadStream(path.join(__dirname, 'logs.log'));
  res.setHeader('Content-Type', 'text/plain');
  readStream.on('open', () => {
    readStream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Running on http://${hostname}:${port}`);
});

module.exports = app;
