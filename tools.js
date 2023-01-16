const pool = require('./pool.js');
const bcrypt = require('bcrypt');

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

//Return true if the param is not safe, false otherwise 
module.exports.checkSQLInjection = function (param) {
    // Regular expression to match SQL keywords
    //const sqlKeywords = /select|insert|update|delete|drop|alter|create|union|--|\/\*|\*|\.\.\/|\.\/|UNION|file|cast|convert|char|;|or|and|not/i;

    if (/*sqlKeywords.test(param)*/!/^[a-zA-Z0-9]+$/.test(param)){
        return true;
    }
    return false;
}

module.exports.hashPassword = function(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

module.exports.comparePasswords = function(plaintextPassword, hashedPassword) {
    return bcrypt.compare(plaintextPassword, hashedPassword.toString('hex'));
}

module.exports.parseJwt = function(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}