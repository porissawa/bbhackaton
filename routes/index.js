const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Site = require('../models/Site');

const router = express.Router();

// helper funcs
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

router.get('/', (req, res) => {
  Site.findById('5d3b0a2877bf8e034964d4a4')
    .then((site) => {
      const newAccessCount = site.accesses + 1;
      Site.findByIdAndUpdate('5d3b0a2877bf8e034964d4a4', { accesses: newAccessCount })
        .then(() => res.render('index'))
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
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

  User.findOne({ cpf }, 'cpf', (err, user) => {
    if (user !== null) {
      req.flash('user cpf error', 'Sorry, this CPF is already registered. We only allow one coupon per person.');
      res.render('index', { message: req.flash('user cpf error') });
      return;
    }

    const confCode = generateConfCode();

    let newUser = {};

    if (testaCPF(cpf)) {
      newUser = new User({ name, email, cpf, confirmationCode: confCode });
      newUser.save()
        .then((usr) => {
          Site.findById('5d3b0a2877bf8e034964d4a4')
            .then((site) => {
            // send email
              const transporter = nodemailer.createTransport({
                host: 'smtp.sparkpostmail.com',
                port: 587,
                secure: false,
                authMethod: 'LOGIN',
                auth: {
                  user: 'SMTP_Injection',
                  pass: '452d52801b88584c40c03c698255951ff9e061c0',
                },
              });

              transporter.sendMail({
                from: '"BluLife 👻" <bluelife@ironhackers.dev>',
                to: email,
                subject: 'Welcome to Servo-Service! Please confirm your account.',
                text: `
                Hi, there!
                Welcome to Servo-Service, the premier service for services!
                Please, click on the link below to confirm your account:
                http://ADICIONAR ROTA AQUI/${confCode}`,
                html: `
                <h3>Hi, there!</h3>
                <p>Welcome to BluLife, the premier service for services!</p>
                <p>Please, click <a href="http://ADICIONARROTAAQUI/${confCode}">here</a> to confirm your account.</p>`,
              });
              const newSignupsCount = site.signups + 1;
              Site.findByIdAndUpdate('5d3b0a2877bf8e034964d4a4', { signups: newSignupsCount })
                //
                //
                // RENDER VAI SER ESSE?
                //
                //
                .then(() => res.render('index'))
                .catch(e => console.log(e));
            })
            .catch(error => console.log(error));
        })
        .catch(e => console.log(e));
    } else {
      req.flash('error', 'Please, check your CPF number and try again.');
      res.render('index', { message: req.flash('error') });
    }
  });
});


module.exports = router;
