let cfg = require('../config.json');
let tool = require('../tools');
const express = require('express');
const router = express.Router();
const pool = require('../pool.js');
const jwt = require('jsonwebtoken');
const { checkInjection } = require('../middleware');


router.get('/', (req, res) => {
    tool.executeQuery(`SELECT t.name as theatername, m.name as moviename, s.* FROM shows s 
    JOIN movies m ON m.id=s.id_movie
    JOIN theaters t ON t.id=s.id_theater`).then((result) => {
        res.send(result.rows);
    }).catch((err) => {
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});

router.get('/:id', (req, res) => {
    tool.checkExistingInTable("shows", req.params.id).then((result) => {
        tool.executeQuery(  `t.name as theatername, m.name as moviename, s.* FROM shows s
                            JOIN movies m ON m.id=s.id_movie
                            JOIN theaters t ON t.id=s.id_theater
                            WHERE s.id=${req.params.id}`
        ).then((result) => {
            if(result.rowCount <= 0){
                res.status(400).json({
                    message: "error occurred",
                    error: `No show with id=${req.params.id} found`
                });
            } else {
                res.send(result.rows[0])
            }
        }).catch((err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
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

router.post('/add', (req, res) => {
    tool.executeQuery(
        `INSERT INTO shows (id_theater, id_movie, date, time)
        VALUES (${req.body.id_theater}, ${req.body.id_movie}, '${req.body.date}', '${req.body.time}')
        RETURNING id`
    ).then((result) => {
        res.status(200).json({
            message: "new show created",
            lastId: result.rows[0].id
        });
        return;
    }).catch((err) => {
        console.log(err);
                    res.status(400).json({
                message: "error occurred",
                error: err
            });
        return;
    })
});

router.delete('/:id', (req, res) => {
    tool.checkExistingInTable("shows", req.params.id).then((result) => {
        tool.executeQuery(
            `DELETE FROM shows WHERE id=${req.params.id}`
        ).then((result) => {
            res.status(200).json({
                message: `show with id=${req.params.id} DELETED`
            });
        }).catch((err) => {
            console.log(err);
                        res.status(400).json({
                message: "error occurred",
                error: err
            });
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


router.put('/:id', (req, res) => {
    tool.checkExistingInTable("shows", req.params.id).then((result) => {
        tool.executeQuery(
            `UPDATE shows 
            SET id_theater=${req.body.id_theater}, id_movie=${req.body.id_movie}, date='${req.body.date}', time='${req.body.time}'
            WHERE id=${req.params.id}`
        ).then((result) => {
            res.status(200).json({
                message: `show with id=${req.params.id} UPDATED`
            });
        }).catch((err) => {
            console.log(err);
                        res.status(400).json({
                message: "error occurred",
                error: err
            });
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


module.exports = router;