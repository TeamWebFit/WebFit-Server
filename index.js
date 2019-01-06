/*Allgemeines*/
const express = require('express');
var router = express.Router();
/*GraphQL*/
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const { graphql } = require('graphql');
const cors = require('cors');
/*MongoDB*/
const mongoose = require('mongoose');
/*E-Mails*/
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
var token, link, email;

/* Make some SSL Magic */

const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/projekt-webfit.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/projekt-webfit.de/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/projekt-webfit.de/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

/*Axios*/
const axios = require('axios');

/*Allow cross-origin requests*/
app.use(cors());
/* ======================================== */

/*Double-Opt-In & Passwort vergessen*/
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*Double-Opt-In*/
app.post('/api/form', (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
    token = req.body.authToken;
    link = "http://localhost:3000/verify" + "?token=" + token;
    console.log("createTestAccount");
    const htmlEmail = `
      <h3>WebFit Registrierung</h3>
      <h4>Hurra! Du hast Dich bei WebFit registriert.</h4>
      <ul>
        <li>Name: ${req.body.firstName}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <p>Bitte bestätige Deine E-Mail-Adresse, indem Du auf <a href="${link}">diesen Link klickst.</a></p>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'usslingk@gmail.com',
        pass: 'BaluBarney'
      }
    })

    let mailOptions = {
      from: 'WebFit <app@webfit.app>', // sender address
      to: req.body.email, // list of receivers
      replyTo: 'app@webfit.app',
      subject: 'Welcome to Webfit <3', // Subject line
      text: req.body.message, // plain text body
      html: htmlEmail // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
});

httpServer.listen(8000, () => {
	console.log('HTTP Server running on port 8000');
});

httpsServer.listen(4000, () => {
	console.log('HTTPS Server running on port 4000');
});

/*End Double-Opt-In & PW vergessen*/

/*Password reset*/
app.post('/api/resetPassword', (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
    email = req.body.email;
    link = "http://localhost:3000/newPassword" + "?email=" + email;
    console.log("createTestAccount");
    const htmlEmail = `
      <h3>Neues Passwort für WebFit!</h3>
      <p>Setze Dein neues WebFit-Passwort, indem Du <a href="${link}">auf diesen Link klickst.</a></p>
      <p>Diese Aktion wurde nicht von Dir ausgelöst? Dann kannst Du diese Email einfach ignorieren.</p>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'usslingk@gmail.com',
        pass: 'BaluBarney'
      }
    })

    let mailOptions = {
      from: 'WebFit <app@webfit.app>', // sender address
      to: req.body.email, // list of receivers
      replyTo: 'app@webfit.app',
      subject: 'Neues Passwort für WebFit', // Subject line
      html: htmlEmail // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
});

/*Password reset*/

/*GraphQL-Server*/
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  ssl: true
}));//is fired whenever a graphql request comes in

app.listen(4000, () => {
  console.log("GraphQL Server is listening on 4000");
})
/*End GraphQL Server*/

/*MongoDB*/
mongoose.connect('mongodb://webfitapp:webfit4life@projekt-webfit.de:27017/WebFitDB');
mongoose.connection.once('open', () => {
  console.log('connected to database');
});
/*End MongoDB*/

/*  WebFit-API */
/*  This API listen for TrackerID&TrackerTyp&UserID
    to make an HTTP-Request to a wearhouse */

app.listen(4009, () => {
  console.log("WebFit-API-Server is running on 4009")

})

app.get('/', (req, res) => {
  res.send('WebFit-Server is online')
})

// Trackermanager

var syncsingle = require('./trackermanager/syncsingle');
app.get('/sync', syncsingle);

var syncfitbit = require('./trackermanager/sync/fitbit')
app.get('/sync/fitbit', syncfitbit);

var syncgoogle = require('./trackermanager/sync/google')
app.get('/sync/google', syncgoogle);

// Sync all Tracker
var syncall = require('./trackermanager/syncall');
app.get('/syncall', syncall);


