let tool = require('./tools');
const express = require('express');
const router = express.Router();

/** Return an array of users */
router.get('/', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM users`
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
router.get('/:id', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM users WHERE id=${req.params.id}`
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
router.post('/add', (req, res) => {
    tool.executeQuery(
        `INSERT INTO users (name, password, email, isadmin)
        VALUES('${req.body.name}', '${req.body.password}', '${req.body.email}', '${req.body.isadmin}') 
        RETURNING id`
    ).then((result) => {
        res.status(200).json({
            message: "new user created",
            lastId: result.rows[0].id
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

module.exports = router;