const Helper = require('../helper');
const express = require('express');
const superagent = require('superagent');

const app = express();
const googleApiKey = Helper.getParamFromArguments('googleApiKey=');
const googleBaseUrl = 'https://maps.googleapis.com/maps/api/';

checkGoogleApiKey();

// ToDo: error handling

app.get('/autocomplete', (request, res) => {
    const {language, input} = request.query;
    const url = 'place/autocomplete/json';
    const params = {key: googleApiKey, language, input};

    superagent.get(googleBaseUrl + url).query(params)
        .end((error, response) => {
            if (Helper.isErrorAndDefaultErrorHandling(error, res)) return;
            const predictions = response.body.predictions.map(({description = '', place_id = ''}) => {
                return {name: description, id: place_id};
            });

            res.send({predictions});
        });
});

app.get('/distance', (request, res) => {
    const {origin, destination} = request.query;
    const url = 'directions/json';
    const params = {key: googleApiKey, origin, destination};

    superagent.get(googleBaseUrl + url).query(params)
        .end((error, response) => {
            if (Helper.isErrorAndDefaultErrorHandling(error, res)) return;
            if (!response.body || !response.body.routes || !response.body.routes[0] || !response.body.routes[0].legs || !response.body.routes[0].legs[0] || !response.body.routes[0].legs[0].distance || !response.body.routes[0].legs[0].distance.value) {
                res.send({start_address: '', end_address: '', totalDistance: ''});
                return;
            }
            const {start_address = '', end_address = ''} = {...response.body.routes[0].legs[0]};
            const totalDistance = response.body.routes[0].legs[0].distance.value;

            res.send({start_address, end_address, totalDistance});
        });
});

module.exports = app;

function checkGoogleApiKey() {
    if (!googleApiKey) {
        throw new Error('Google API key is needed to start this application!')
    }
}
