let tool = require('../tools');
const express = require('express');
const { returnJWTData, checkUser, checkAdmin } = require('../check_auth');
const router = express.Router();


router.get('/qrcode/:ticketId', checkUser, (req, res) => {
    tool.executeQuery(`
        SELECT * FROM tickets
        WHERE id=${req.params.ticketId}
    `).then((result) => {
        if(result.rowCount === 0){
            res.status(400).json(
                {"error": `no ticket with id=${req.params.ticketId} found`}
            );
        } else {
            let code = tool.createTicketQR(result.rows[0].id_user, result.rows[0].id_show, result.rows[0].id_seat, req.params.ticketId);
            res.status(200).json(
                {"code":code}
            );
        }

    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});


router.post('/checkqr/:idShow', checkAdmin, (req, res) => {
    let decodedData = tool.decodeTicketQR(req.body.qrcode);
    console.log(decodedData);
    tool.executeQuery(
        `SELECT * FROM tickets 
        WHERE id=${decodedData.ticketId} AND id_seat=${decodedData.seatId} AND id_show=${decodedData.showId} AND id_user=${decodedData.userId}`
    ).then((result) => {
        console.log(req.params.idShow);
        if(result.rowCount != 0 && result.rows[0].id_show == req.params.idShow){
            res.status(200).json(
                {
                    "response":"approved",
                    "data": result.rows[0]
                }
            );
            return;
        } else if(result.rowCount === 0){
            res.status(400).json({
                "response":"rejected",
                "message":"ticket information provided doesn't exist"
            })
        } else if(result.rows[0].id_show != req.params.idShow){
            res.status(400).json({
                "response":"rejected",
                "message":`ticket not valid for the  show with id=${req.params.idShow}`
            })
        } else {
            res.status(400).json({
                "response":"rejected",
                "message":`Something wrong happened`
            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
})

router.get('/ofuser', checkUser, (req, res) => {
    let userData = returnJWTData(req.headers.authorization);
    tool.executeQuery(
        `SELECT t.id, t.price, u.name, s.date, s.time 
        FROM tickets t
        JOIN users u ON u.id=t.id_user
        JOIN shows s ON s.id=t.id_show
        WHERE t.id=${userData.id}`
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
router.get('/:id', checkUser, (req, res) => {
    tool.executeQuery(
        `SELECT t.id, t.price, u.name, s.date, s.time 
        FROM tickets t
        JOIN users u ON u.id=t.id_user
        JOIN shows s ON s.id=t.id_show
        WHERE t.id=${req.params.id}`
    ).then((result) => {
        res.status(200).send(
            result.rows[0]
        );
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});


/** Return an array of tickets */
router.get('/', checkAdmin, (req, res) => {
    tool.executeQuery(
        `SELECT t.id, t.price, u.name, s.date, s.time FROM tickets as t
         JOIN users as u on u.id = t.id_user
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

/**Add an user taken the details from the body of the request. It return a message and the last id*/
router.post('/add', checkAdmin, (req, res) => {
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