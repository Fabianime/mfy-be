const Helper = require('../helper');
const express = require('express');
const superagent = require('superagent');

const app = express();
const googleApiKey = Helper.getParamFromArguments('googleApiKey=');
const googleBaseUrl = 'https://maps.googleapis.com/maps/api/';

checkGoogleApiKey();

app.get('/autocomplete', (request, res) => {
    const {language, input} = request.query;
    const url = 'place/autocomplete/json';
    const params = {key: 'googleApiKey', language, input};

    superagent.get(url).query(params)
        .end((error, response) => {
            if (Helper.isErrorAndDefaultErrorHandling(error, res)) return;

            res.send(response.body);
        });
});

app.get('/distance', (request, res) => {
    const {origin, destination} = request.query;
    const url = 'directions/json';
    const params = {key: googleApiKey, origin, destination};

    superagent.get(googleBaseUrl + url).query(params)
        .end((error, response) => {
            if (Helper.isErrorAndDefaultErrorHandling(error, res)) return;

            res.send(response.body);
        });
});

module.exports = app;

function checkGoogleApiKey() {
    if (!googleApiKey) {
        throw new Error('Google API key is needed to start this application!')
    }
}
