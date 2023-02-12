let tool = require('../tools');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
let cfg = require('../config.json');
const checkAuth = require('../check_auth');
const { checkInjection, hashPassword } = require('../middleware');

/** Return an array of users */
router.get('/', /*checkAuth.checkAdmin,*/ (req, res) => {
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


router.put('/updateuser/:id', /*checkAuth.checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("users", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
    tool.executeQuery(
        `UPDATE users 
        SET isadmin='true'
        WHERE id=${req.params.id}`
    ).then((result) => {
        res.status(200).json({
            message: "update successful",
            id:req.params.id
        });
    }).catch((err)=> {
        console.log(err);
        res.status(400).send(err);
    })
});

/** Return a json with the detail of the user with id=id given as param*/
router.get('/:id', /*checkAuth.checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("users", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
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
router.post('/register', hashPassword, (req, res) => {
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


router.delete('/:id', /*checkAuth.checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("users", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
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
});

module.exports = router;