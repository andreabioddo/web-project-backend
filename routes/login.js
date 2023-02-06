let cfg = require('../config.json');
let tool = require('../tools');
const express = require('express');
const router = express.Router();

const pool = require('../pool.js');

const jwt = require('jsonwebtoken');

// login route creating/returning a token on successful login
router.post('/', (req, res) => {
/*
    tool.executeQuery("select password from users where id=30")
    .then((pp) => {
        tool.compareTexts("password", pp.rows[0].password.toString()).then((uu)=>{console.log("QUI:   " + uu);})
    })

    tool.hashText(req.body.password)
    .then((rrr) => {
        pool.query(`
        INSERT INTO users (name, email, password, isadmin) VALUES 
        ('Alexander Martinez', '${req.body.email}', '${rrr}', false) 
        `)

    })


    console.log(tool.checkSQLInjection(req.body.email));
    
    //tool.compareTexts()
*/
    if(!tool.checkSQLInjection(req.body.email)){
        res.status(401).json({
            "message":"Data invalid",
            "error": "Data invalid"
        });
        return;
    }
    let query = `SELECT * FROM users WHERE email='${req.body.email}' AND password='${req.body.password}'`;
    pool.query(query)
    .then (results => {
        let resultRows = results.rows;
        /*console.log((resultRows[0].password.toString()));
        tool.compareTexts(req.body.password, resultRows[0].password.toString())
        .then((result) => {
            console.log("RESULT: " + result);
        })*/
            if(results.rowCount == 0){//if the rowCounter is 0, it means that the compination email, password is wrong
                res.status(401).json({
                    "message":"Login failed",
                    "error": "Invalid credentials"
                });
            } else {
                let resultUser = resultRows[0];
                console.log(resultUser);
                const jwtToken = jwt.sign({user:resultUser.name, isAdmin:resultUser.isadmin, id:resultUser.id}, cfg.auth.jwt_key, {expiresIn: cfg.auth.expiration});//create the token
                req.headers.authorization = jwtToken;
                res.status(200).json({
                    message: "login successful",
                    login: jwtToken,
                    isAdmin:resultUser.isadmin
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