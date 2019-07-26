const nodemailer = require('nodemailer');

const confirmationCode = 123;

const transporter = nodemailer.createTransport({
    host: 'smtp.sparkpostmail.com',
    port: 587, 
    secure: false,
    authMethod: "LOGIN",
    auth: {
      user: 'SMTP_Injection',
      pass: '452d52801b88584c40c03c698255951ff9e061c0',
    },
  });

  transporter.sendMail({
    from: '"Servo-Service 👻" <bluelife@ironhackers.dev>',
    to: "layzafloriano@gmail.com",
    subject: 'Welcome to Servo-Service! Please confirm your account.',
    text: `
    Hi, there!
    Welcome to Servo-Service, the premier service for services!
    Please, click on the link below to confirm your account:
    http://localhost:3000/auth/confirm/${confirmationCode}`,
    html: `
    <h3>Hi, there!</h3>
    <p>Welcome to BluLife, the premier service for services!</p>
    <p>Please, click <a href="http://localhost:3000/auth/confirm/${confirmationCode}">here</a> to confirm your account.</p>`,
  })