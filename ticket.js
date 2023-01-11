let tool = require('./tools');
const express = require('express');
const router = express.Router();

/** Return an array of tickets */
router.get('/', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM tickets as t
         JOIN user as u on u.id = t.id_user
         JOIN shows as sh on sh.id = t.id_show
         JOIN seats as st on st.id = t.id_seat`
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
        `SELECT * FROM ticket WHERE id=${req.params.id}`
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
        `INSERT INTO tickets (price, id_seat, id_user, id_show)
        VALUES('${req.body.price}', '${req.body.id_seat}', '${req.body.id_user}', ${req.body.id_show}) 
        RETURNING id`
    ).then((result) => {
        res.status(200).json({
            message: "new ticket created",
            lastId: result.rows[0].id
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

module.exports = router;