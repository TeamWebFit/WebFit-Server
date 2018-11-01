/*Allgemeines*/
const { ApolloServer, gql } = require('apollo-server');
const express = require('express');
/*GraphQL*/
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
/*MongoDB*/
const mongoose = require('mongoose');
/*E-Mails*/
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
var token, link, email;

/*Allow cross-origin requests*/
app.use(cors());

/*Double-Opt-In & Passwort vergessen*/
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*Double-Opt-In*/
app.post('/api/form', (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
    token= req.body.authToken;
    link="http://localhost:3000/verify"+"?token="+token;
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
/*End Double-Opt-In & PW vergessen*/

/*Password reset*/
app.post('/api/resetPassword', (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
    email = req.body.email;
    link="http://localhost:3000/newPassword"+"?email="+email;
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
app.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true
}));//is fired whenever a graphql request comes in

app.listen(4000, () => {
  console.log("GraphQL Server is listening on 4000");
})
/*End GraphQL Server*/

/*MongoDB*/
mongoose.connect('mongodb://webfit_user:!webfit4life!@ds137643.mlab.com:37643/webfit_db');
mongoose.connection.once('open', () => {
  console.log('connected to database');
});
/*End MongoDB*/


/*
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});*/
