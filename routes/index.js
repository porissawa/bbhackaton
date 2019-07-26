const express = require('express');
const User = require('../models/User');
const Site = require('../models/Site');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/cupom/:confirmationCode', (req, res) => {
  res.render('cupom');
});

router.post('/sendform', (req, res) => {
  const {
    name,
    email,
    cpf,
  } = req.body;

  function testaCPF(strCPF) {
    let Soma;
    let Resto;
    Soma = 0;
    if (strCPF.length > 11 || strCPF.length < 10) return false;

    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    }

    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;

    if (Resto != parseInt(strCPF.substring(10, 11)) ) return false;
    return true;
  }

  function generateConfCode() {
    const possibilities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const confCode = [];
    for (let i = 0; i <= 15; i += 1) {
      confCode.push(possibilities[Math.floor(Math.random() * possibilities.length)]);
    }
    return confCode.join('');
  }

  const confCode = generateConfCode();

  let newUser = {};

  if (testaCPF(cpf)) {
    newUser = new User({ name, email, cpf, confirmationCode: confCode });
    newUser.save()
      .then((user) => {
        console.log(user);
        res.render('index');
      })
      .catch(e => console.log(e));
  } else {
    req.flash('error', 'Please, check your CPF number and try again.');
    res.render('index', { message: req.flash('error') });
  }
});

module.exports = router;
