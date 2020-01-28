const Helper = require('../helper');
const express = require('express');
const HttpStatus = require('http-status-codes');
const bodyParser = require('body-parser');
const Freemarker = require('freemarker');
const nodeMailer = require('nodemailer');
const fs = require('fs');

const mailServerPasswordKey = 'mailServerPass=';
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const mailServerConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'noReply.m4y@gmail.com',
        pass: ''
    }
};
const mailOptions = {
    subject: 'Test E-Mail', // Subject line
    from: '"No Replay" <noReply.m4y@gmail.com>', // sender address
    to: '', // list of receivers
    html: '', // plain text body
};

initAndCheckMailServerPassword();

app.post('/sendContactRequest', (request, response) => {
    const freemarker = new Freemarker({tagSyntax: 'squareBracket'});
    const currentTemplate = getCustomerTemplateBaseOnLanguage(request.body.language);

    freemarker.render(currentTemplate, {...request.body}, (templateError, renderTemplate) => {
        if (Helper.isErrorAndDefaultErrorHandling(templateError, response)) return;
        const customerMailOption = { ...mailOptions };
        customerMailOption.to = 'fabian.bedarf@evia.de'; // request.body.email;
        customerMailOption.html = renderTemplate;

        sendRenderedTemplateToAddress(customerMailOption, response);


    });
});

function initAndCheckMailServerPassword() {
    mailServerConfig.auth.pass = Helper.getParamFromArguments(mailServerPasswordKey);
    if (!mailServerConfig.auth.pass) {
        throw new Error('Mail server password is needed to start this application!')
    }
}

function getCustomerTemplateBaseOnLanguage(language) {
    const templateName = `template${language}.ftl`;
    return fs.readFileSync('./templates/templateDe.ftl', 'utf-8');
}

function sendRenderedTemplateToAddress(options, response) {
    const transporter = nodeMailer.createTransport(mailServerConfig);
    transporter.sendMail(options, (sendMailError) => {
        if (Helper.isErrorAndDefaultErrorHandling(sendMailError, response)) return;

        response.status(HttpStatus.OK);
        response.send({message: HttpStatus.getStatusText(HttpStatus.OK)});
    });
}

module.exports = app;
