let tool = require('../tools');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
let cfg = require('../config.json');
const checkAuth = require('../check_auth');

/** Return an array of users */
router.get('/', checkAuth.checkAdmin, (req, res) => {
    tool.executeQuery(
        `SELECT id, name, email, isadmin FROM users`
    ).then((result) => {
        res.status(200).send(
            result.rows
        );
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

/** Return a json with the detail of the user with id=id given as param*/
router.get('/:id', checkAuth.checkAdmin, (req, res) => {
    tool.executeQuery(
        `SELECT id, name, email, isadmin FROM users WHERE id=${req.params.id}`
    ).then((result) => {
        res.status(200).send(
            result.rows[0]
        );
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

/**Add an user taken the details from the body of the request. It return a message and the last id*/
router.post('/register', (req, res) => {
    if(tool.checkSQLInjection(req.body.email) || tool.checkSQLInjection(req.body.password) || tool.checkSQLInjection(req.body.name)){
        res.status(401).json({
            "message":"Data invalid",
            "error": "Data invalid"
        });
        return;
    }
    tool.executeQuery(
        `INSERT INTO users (name, password, email, isadmin)
        VALUES('${req.body.name}', '${req.body.password}', '${req.body.email}', 'false')`
    ).then((result) => {
        const jwtToken = jwt.sign({user:req.body.email, isAdmin:false}, cfg.auth.jwt_key, {expiresIn: cfg.auth.expiration});//create the token
        req.headers.authorization = jwtToken;
        res.status(200).json({
            message: "registartion successful",
            login: jwtToken,
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});


router.delete('/:id', checkAuth.checkAdmin, (req, res) => {
    tool.executeQuery(`SELECT id FROM users WHERE id=${req.params.id}`)
    .then((result)=>{
        if(result.rowCount <= 0){
            res.status(400).json({
                message: "error occurred",
                error: `No user with id=${req.params.id} found`
            });
            return;
        }
        tool.executeQuery(`DELETE FROM users WHERE id=${req.params.id}`)
        .then((result)=>{
            res.status(200).json({
                message:`User with id=${req.params.id} DELETED`
            });
        }).catch((err)=>{
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        })
    }).catch((err)=>{
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});

module.exports = router;