require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const hbs = require('hbs');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://localhost/bbhackaton', { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'blueberries',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

const index = require('./routes/index');

app.use('/', index);

app.listen(PORT, console.log(`Ouvindo na porta ${PORT}`));

module.exports = app;
