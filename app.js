require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose
  .connect('mongodb://localhost/bbhackaton', { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });


app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
