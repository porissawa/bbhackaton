const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { ensureLoggedOut } = require('connect-ensure-login');
const User = require('../models/User');

const router = express.Router();

// Signup novo membro
router.get('/signup', ensureLoggedOut(), (req, res) => {
  res.render('signup');
});

// Signup novo membro
router.post('/signup', ensureLoggedOut(), (req, res) => {
  const { username, name, password, confirmPassword } = req.body;

  // Check validity
  if (username === '' || password === '') {
    res.render('signup', { message: 'Indicate email and password' });
    return;
  }

  if (password !== confirmPassword) {
    res.render('signup', { message: 'Passwords don\'t match' });
    return;
  }

  User.findOne({ username }, 'email', (err, user) => {
    if (user !== null) {
      res.render('signup', { message: 'This email is already in use' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const tokenFunc = () => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i += 1) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }
      return token;
    };

    const authToken = tokenFunc();

    const newUser = new User({
      name,
      password: hashPass,
      username,
      confirmationCode: authToken,
    });

    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((e) => {
        console.log(e);
        res.render('signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/login', ensureLoggedOut(), (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/dashboard',
  failureRedirect: '/login',
  passReqToCallback: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
