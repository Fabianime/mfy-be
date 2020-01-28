const express = require('express');
const exphbs = require('express-handlebars');
const mailApi = require('./routs/sendMail');
const googleApi = require('./routs/google');

const app = express();


// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
    const allowedOrigins = ['http://127.0.0.1', 'http://localhost:4200', 'https://just-bedarf.de'];
    const { origin } = req.headers;

    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow (POST, OPTIONS, PUT, PATCH, DELETE)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

app.use('', mailApi);
app.use('', googleApi);


app.listen('8080', () => console.log('Started'));
