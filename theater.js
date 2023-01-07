let tool = require('./tools');
const express = require('express');
const router = express.Router();

/** Return an array of theaters */
router.get('/', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM theaters`
    ).then((result) => {
        res.status(200).send(
            result.rows
        );
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

/** Return a json with the detail of the theater with id=id given as param*/
router.get('/:id', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM theaters WHERE id=${req.params.id}`
    ).then((result) => {
        res.status(200).send(
            result.rows[0]
        );
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

/**Add an theater taken the details from the body of the request. It return a message and the last id*/
router.post('/add', (req, res) => {
    tool.executeQuery(
        `INSERT INTO theaters (name, number_of_seats)
        VALUES('${req.body.name}', '${req.body.number_of_seats}') 
        RETURNING id`
    ).then((result) => {
        res.status(200).json({
            message: "new theater created",
            lastId: result.rows[0].id
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

router.post('/addseat/:num', (req, res) => {

});

module.exports = router;