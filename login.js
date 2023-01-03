let cfg = require('./config.json');
let tool = require('./tools');
const express = require('express');
const router = express.Router();

const pool = require('./pool.js');

const jwt = require('jsonwebtoken');

// login route creating/returning a token on successful login
router.post('/', (req, res) => {
    let query = `SELECT * FROM users WHERE login='${req.body.user}' AND password='${req.body.password}'`;
    pool.query(query)
    .then (results => {
        let resultRows = results.rows;
            if(results.rowCount == 0){//if the rowCounter is 0, it means that the compination email, password is wrong
                res.status(400).json({
                    "message":"Login failed",
                    "error": "Invalid credentials"
                });

            } else {
                let resultUser = resultRows[0];
                const jwtToken = jwt.sign({user:resultUser.login}, cfg.auth.jwt_key, {expiresIn: cfg.auth.expiration});//create the token
                req.headers.authorization = jwtToken;
                res.status(200).json({
                    message: "login successful",
                    login: jwtToken,
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({
                "message":"Login failed",
                "error": error
            });
        });

});
module.exports = router;
