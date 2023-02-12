let tool = require('../tools');
const express = require('express');
const { checkUser, checkAdmin } = require('../check_auth');
const router = express.Router();

/** Return an array of users */
router.get('/', /*checkUser,*/ (req, res) => {
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
router.get('/:id', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("movies", req.params.id).then((result) => {
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
    }).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
        }
    )
});

/**Add an user taken the details from the body of the request. It return a message and the last id*/
router.post('/add', /*checkAdmin,*/ (req, res) => {
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

router.put('/:id', /*checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("movies", req.params.movieId).then((result) => {
        tool.executeQuery(
            `UPDATE movies 
            SET name='${req.body.name}', description='${req.body.description}',duration=${req.body.duration}, age=${req.body.age}
            WHERE id=${req.params.id}`
        ).then((result) => {
            res.status(200).json({
                message: `movie with id=${req.params.id} UPDATED`
            });
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

router.get('/show/:movieId', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("movies", req.params.movieId).then((result) => {
        tool.executeQuery(
            `SELECT s.id as showId, t.name as theaterName, t.id as theaterId, t.number_of_seats, s.date as date, s.time as time 
            FROM shows as s
            INNER JOIN theaters as t ON s.id_theater=t.id
            INNER JOIN movies as m ON m.id=s.id_movie
            WHERE m.id=${req.params.movieId}`
        ).then((res1)=>{
            res.status(200).send(res1.rows);
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

router.get('/detailseats/:showId', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("shows", req.params.showId).then((result) => {
        tool.executeQuery(
            `SELECT s.id as showId, t.name as theaterName, t.id as theaterId, t.number_of_seats, s.date as date, s.time as time 
            FROM shows as s
            INNER JOIN theaters as t ON s.id_theater=t.id
            INNER JOIN movies as m ON m.id=s.id_movie
            WHERE s.id=${req.params.showId}`
        ).then((res1)=>{
            tool.executeQuery(
                `SELECT s.* 
                FROM shows AS sh 
                INNER JOIN seats AS s on s.id_theater=sh.id_theater
                WHERE sh.id=${req.params.showId} AND (s.id) NOT IN (select id_seat from tickets as t where t.id_show=sh.id)`
            ).then((res2)=>{
                tool.executeQuery(
                    `SELECT s.* 
                    FROM shows AS sh 
                    INNER JOIN seats AS s on s.id_theater=sh.id_theater
                    WHERE sh.id=${req.params.showId} AND (s.id) IN (select id_seat from tickets as t where t.id_show=sh.id)`
                ).then((res3) => {
                    let finalResult = res1.rows[0];
                    finalResult['avaiable_seats']=res2.rows;
                    finalResult['occupied_seats']=res3.rows;
                    res.status(200).send(finalResult);
                }).catch((err) => {
                    console.log(err);
                    res.status(400).send(err);
                })
            }).catch((err) => {
                console.log(err);
                res.status(400).send(err);
            })
    
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

router.delete('/:id', /*checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("movies", req.params.id).then((result) => {
        tool.executeQuery(
            `SELECT id FROM movies WHERE id=${req.params.id}`
        ).then((result) => {
            tool.executeQuery(`DELETE FROM movies WHERE id=${req.params.id}`).then((finalResult) => {
                res.status(200).json({
                    message: `Movie with id=${req.params.id} DELETED`
                }); 
            }).catch((err) => {
                res.status(400).json({
                    message: "error occurred",
                    error: err
                });
            });
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

module.exports = router;