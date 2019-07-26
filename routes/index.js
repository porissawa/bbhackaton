const express = require('express');
const nodemailer = require('nodemailer');
const { ensureLoggedIn } = require('connect-ensure-login');
const User = require('../models/User');
const Site = require('../models/Site');
const lojas = require('../seedlojas.json');

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
  Site.findById(process.env.LOCALSITEDOCID)
    .then((site) => {
      const newAccessCount = site.accesses + 1;
      Site.findByIdAndUpdate(process.env.LOCALSITEDOCID, { accesses: newAccessCount })
        .then(() => res.render('index', { lojas }))
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
});

router.get('/cupom/:confirmationCode', (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmationCode }, { hasConfirmed: true })
    .then((user) => {
      Site.findById(process.env.LOCALSITEDOCID)
        .then((site) => {
          console.log(user);
          const newConfirmedSignupsCount = site.confirmedSignups + 1;
          Site.findByIdAndUpdate(process.env.LOCALSITEDOCID, { confirmedSignups: newConfirmedSignupsCount })
            .then(() => res.render('cupom', { user }))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    })
    .catch(err => console.log(err));
});

router.post('/sendform', (req, res) => {
  const {
    name,
    username,
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
      newUser = new User({ name, username, cpf, confirmationCode: confCode });
      newUser.save()
        .then((usr) => {
          Site.findById(process.env.LOCALSITEDOCID)
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
                from: '"BluLife" <bluelife@gin.ink>',
                to: username,
                subject: 'Welcome to BluLife! Click to redeem your coupon.',
                text: `
                Hi, there!
                Welcome to BluLife, the super blueberry!
                Please, click on the link below to redeem your coupon:
                http://blulife.ironhackers.tech/cupom/${confCode}`,
                html: `
                <h3>Hi, there!</h3>
                <p>Welcome to BluLife, the super blueberry!</p>
                <p>Please, click <a href="http://blulife.ironhackers.tech/cupom/${confCode}">here</a> to redeem your coupon.</p>`,
              });
              const newSignupsCount = site.signups + 1;
              Site.findByIdAndUpdate(process.env.LOCALSITEDOCID, { signups: newSignupsCount })
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

router.get('/dashboard', ensureLoggedIn(), (req, res) => {
  Site.findById(process.env.LOCALSITEDOCID)
    .then((site) => {
      res.render('dashboard', { site });
    })
    .catch(e => console.log(e));
});


module.exports = router;
