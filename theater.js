let tool = require('./tools');
const express = require('express');
const pool = require('./pool');
const router = express.Router();

/** Return an array of theaters */
router.get('/', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM theaters`
    ).then((result) => {
        let ret = [];
        /*for(let r of result.rows){
            pool.query(`SELECT * FROM seats WHERE id_theater=${r.id}`,
            ((seatsRes) => {
                if(seatsRes.rowCount == 0){
                    r['seats'] = [];
                } else {
                    r['seats'] = seatsRes.rows;
                }
                ret.push(r);

            }),((err)=>{
                res.status(400).json({
                    message: "error occurred",
                    error: err
                });
            }))
        }*/
        res.status(200).send(result.rows);
    }).catch((err) => {
        res.status(400).json({
            message: "error occurred",
            error: err
        });
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
        res.status(400).json({
            message: "error occurred",
            error: err
        });
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
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});

router.delete('/:id', (req, res)=>{
    tool.executeQuery(
        `SELECT * FROM theaters WHERE id=${req.params.id}`
    ).then((result) => {
        if(result.rowCount <= 0){
            res.status(400).json({
                message: "error occurred",
                error: `No theater with id=${req.params.id}`
            });
            return;
        }
        tool.executeQuery(`DELETE FROM theaters WHERE id=${req.params.id}`)
        .then((result)=>{
            res.status(200).json({
                message:`Theater with id=${req.params.id} DELETED`
            });
        }).catch((err)=>{
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        })
    }).catch((err)=>{
        res.status(400).json({
            messsage:"An error occurred",
            error:err
        });
    })
});

router.put(':/id', (req, res) => {
    tool.executeQuery(
        `UPDATE theaters
        SET name='${req.body.name}', number_of_seats='${req.body.number_of_seats}'
        WHERE id=${req.params.id}`
    ).then((result)=>{
        res.status(200).json({
            messsage:`Theater with id=${req.params.id} UPDATED`
        });
    }).catch((err)=>{
        res.status(400).json({
            messsage:"An error occurred",
            error:err
        });
    })
})

router.post('/:theaterId/addseat', (req, res) => {
    tool.executeQuery(
        `INSERT INTO seats (number, row, type, removable, id_theater)
        VALUES(${req.body.number}, ${req.body.row}, '${req.body.type}', ${req.body.removale}, ${req.params.theaterId})`
    ).then((result)=>{
        res.status(200).json({
            message:"Seats added"
        });
    }).catch((err)=>{
        res.status(400).json({
            messsage:"An error occurred",
            error:err
        });
    })
});

router.delete('/:theaterId/removeseat/:seatId', (req, res)=>{
    tool.executeQuery(
        `SELECT * FROM seats WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`
    ).then((result) => {
        if(result.rowCount <= 0){
            res.status(400).json({
                message: "error occurred",
                error: `No seat with id=${req.params.seatId} and id_theater=${req.params.theaterId} found`
            });
            return;
        }
        tool.executeQuery(`DELETE FROM seat WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`)
        .then((result)=>{
            res.status(200).json({
                message:`seat with id=${req.params.seatId} and id_theater=${req.params.theaterId} DELETED`
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

router.put('/:theaterId/updateseat/:seatId', (req, res) => {
    tool.executeQuery(
        `SELECT * FROM seats WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`
    ).then((result) => {
        if(result.rowCount <= 0){
            res.status(400).json({
                message: "error occurred",
                error: `No seats with id=${req.params.seatId} and id_theater=${req.params.theaterId} found`
            });
            return;
        }
        tool.executeQuery(`UPDATE seats SET  type='${req.body.type}', removable=${req.body.removale} WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`)
        .then((result)=>{
            res.status(200).json({
                message:`seats with id=${req.params.seatId} and id_theater=${req.params.theaterId} UPDATED`
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
})

module.exports = router;