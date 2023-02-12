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

module.exports.checkExistingInTable = function(table, id) {
    return new Promise((resolve, reject) => {
        //console.log(table !== "shows" && table !== "users" && table !== "tickets" && table !== "movies" && table !== "theaters" && table !== "ratings" && table!=="seats");
        if(table !== "shows" && table !== "users" && table !== "tickets" && table !== "movies" && table !== "theaters" && table !== "ratings" && table!=="seats"){
            reject(`Table ${table} doesn't exist`);
        }
        this.executeQuery(`SELECT * FROM ${table} WHERE id=${id}`).then(
            (res) => {
                if(res.rowCount <= 0){
                    reject(`id=${id} not found in ${table}`);
                } else {
                    resolve();
                }
            }
        ).catch((err) => reject(err))
    })
}