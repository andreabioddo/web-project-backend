let tool = require('./tools');
const express = require('express');
const router = express.Router();

/** Return an array of users */
router.get('/', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM movies`
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
        `SELECT * FROM movies WHERE id=${req.params.id}`
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
        `INSERT INTO movies (name, description, duration, age)
        VALUES('${req.body.name}', '${req.body.description}', '${req.body.duration}', ${req.body.age}) 
        RETURNING id`
    ).then((result) => {
        res.status(200).json({
            message: "new movie created",
            lastId: result.rows[0].id
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

module.exports = router;