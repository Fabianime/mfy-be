const HttpStatus = require('http-status-codes');

class Helper {

    static isErrorAndDefaultErrorHandling(error, res) {
        if (!error) {
            return false;
        }
        console.error(error); // ToDo: use a logger
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send({error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)});
        return true;
    }

    static getParamFromArguments(parameter) {
        return process.argv
            .filter((consoleParam) => consoleParam.indexOf(parameter) !== -1)
            .map((consoleParam) => consoleParam.replace(parameter, ''))[0] || '';
    }
}

module.exports = Helper;
