let tool = require('../tools');
const express = require('express');
const { returnJWTData, /*checkUser,*/ checkAdmin } = require('../check_auth');
const router = express.Router();


router.get('/qrcode/:ticketId', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("tickets", req.params.ticketId).then((result) => {
        let code = tool.createTicketQR(result.rows[0].id_user, result.rows[0].id_show, result.rows[0].id_seat, req.params.ticketId);
        res.status(200).json(
            {"code":code}
        );
    }).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
});


router.post('/checkqr/:idShow', /*checkAdmin,*/ (req, res) => {
    let decodedData = tool.decodeTicketQR(req.body.qrcode);
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

router.get('/ofuser', /*checkUser,*/ (req, res) => {
    let userData = returnJWTData(req.headers.authorization);
    if(!userData){
        res.status(400).json({
            message: "error occurred",
            error: "Your token is not valid"
        });
        return;
    }
    tool.executeQuery(
        `SELECT t.id, t.price, u.name, s.date, s.time, m.name as moviename, tr.name as theatername, st.number as seatnumber, st.row as row
        FROM tickets t
        JOIN users u ON u.id=t.id_user
        JOIN shows s ON s.id=t.id_show
        JOIN theaters tr ON tr.id=s.id_theater
        JOIN movies m ON m.id=s.id_movie
        JOIN seats st ON st.id=t.id_seat
        WHERE t.id_user=${userData.id}`
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
router.get('/:id', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("tickets", req.params.id).then((result) => {
        tool.executeQuery(
            `SELECT t.id, t.price, u.name, s.date, s.time, m.name as moviename, tr.name as theatername, st.number as seatnumber, st.row as row
            FROM tickets t
            JOIN users u ON u.id=t.id_user
            JOIN shows s ON s.id=t.id_show
            JOIN theaters tr ON tr.id=s.id_theater
            JOIN movies m ON m.id=s.id_movie
            JOIN seats st ON st.id=t.id_seat
            WHERE t.id=${req.params.id}`
        ).then((result) => {
            res.status(200).send(
                result.rows[0]
            );
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        })
    }).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
});


/** Return an array of tickets */
router.get('/', /*checkAdmin,*/ (req, res) => {
    tool.executeQuery(
        `SELECT t.id, t.price, u.name, s.date, s.time, m.name as moviename, tr.name as theatername, st.number as seatnumber, st.row as row
        FROM tickets t
        JOIN users u ON u.id=t.id_user
        JOIN shows s ON s.id=t.id_show
        JOIN theaters tr ON tr.id=s.id_theater
        JOIN movies m ON m.id=s.id_movie
        JOIN seats st ON st.id=t.id_seat`
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
router.post('/add', /*checkAdmin,*/ (req, res) => {
    let userData = returnJWTData(req.headers.authorization);
    if(!userData){
        res.status(400).json({
            message: "error occurred",
            error: "Your token is not valid"
        });
        return;
    }
    tool.executeQuery(
        `INSERT INTO tickets (price, id_seat, id_user, id_show)
        VALUES('${req.body.price}', '${req.body.id_seat}', '${userData.id}', ${req.body.id_show}) 
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

router.delete('/:id', /*checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("tickets", req.params.id).then((result) => {
        tool.executeQuery(
            `DELETE FROM tickets WHERE id=${req.params.id}`
        ).then((result) => {
            res.status(200).json({
                message: `Ticket with id=${req.params.id} DELETED`
            });
        }).catch((err) => {
            console.log(err);
            res.status(400).send(err);
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
});

module.exports = router;