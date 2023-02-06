const pool = require('./pool.js');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode')

/**Method that run a query on pg and return a promise with the result of the query */
module.exports.executeQuery = function (sqlQuery) {
    return new Promise((resolve, reject) => {
        pool.query(sqlQuery, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.createTicketQR = function(userId, showId, seatId, ticketId){
    return (userId+"+"+showId+"+"+seatId+"+"+ticketId);
}

module.exports.decodeTicketQR = function(qrCode){
    let res = qrCode.split("+");
    return {
        userId: parseInt(res[0]),
        showId: parseInt(res[1]),
        seatId: parseInt(res[2]),
        ticketId: parseInt(res[3])
    };
}

//Return true if the param is not safe, false otherwise 
module.exports.checkSQLInjection = function (param) {
    // Regular expression to match SQL keywords
    //const sqlKeywords = /select|insert|update|delete|drop|alter|create|union|--|\/\*|\*|\.\.\/|\.\/|UNION|file|cast|convert|char|;|or|and|not/i;

    if (/*sqlKeywords.test(param)*/!/^[a-zA-Z0-9]+$/.test(param)){
        return true;
    }
    return false;
}

module.exports.hashText = function(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

module.exports.compareTexts = function(plaintext, hashedText) {
    return bcrypt.compare(plaintext, hashedText.toString('hex'));
}

module.exports.parseJwt = function(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}