let cfg = require('../config.json');
let tool = require('../tools');
const express = require('express');
const router = express.Router();
const pool = require('../pool.js');
const jwt = require('jsonwebtoken');
const { checkInjection } = require('../middleware');

// login route creating/returning a token on successful login
router.post('/', (req, res) => {
    tool.executeQuery(`SELECT * FROM users WHERE email='${req.body.email}'`)
    .then (results => {
        let resultRows = results.rows;
        if(results.rowCount == 0){//if the rowCounter is 0, it means that the compination email, password is wrong
            res.status(401).json({
                "message":"Login failed",
                "error": "Invalid credentials"
            });
        } else {
            tool.compareTexts(req.body.password, resultRows[0].password).then(
            (result) => {
                if(result){
                    let resultUser = resultRows[0];
                    console.log(resultUser);
                    const jwtToken = jwt.sign({user:resultUser.name, isAdmin:resultUser.isadmin, id:resultUser.id}, cfg.auth.jwt_key, {expiresIn: cfg.auth.expiration});//create the token
                    req.headers.authorization = jwtToken;
                    res.status(200).json({
                        message: "login successful",
                        login: jwtToken,
                        isAdmin:resultUser.isadmin
                    });
                } else {
                    res.status(400).json({
                        "message":"Login failed",
                        "error": "invalid credentials"
                    });
                }
            }).catch((error) => {
                console.log(error);
                res.status(400).json({
                    "message":"Login failed",
                    "error": error
                });
            })
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