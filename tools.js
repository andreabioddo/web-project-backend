const pool = require('./pool.js');

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

