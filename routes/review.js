let tool = require('../tools');
const express = require('express');
const router = express.Router();
const { checkUser, returnJWTData } = require('../check_auth');

router.get('/:movieId', checkUser,(req, res) => {
    tool.checkExistingInTable("movies", req.params.movieId).then((result) => {
        tool.executeQuery(`
            SELECT u.id as userid, u.name, r.stars, r.review FROM ratings as r 
            JOIN users as u ON u.id=r.id_user
            WHERE id_movie=${req.params.movieId}
        `).then((result) => {
            res.status(200).send(
                result.rows
            );
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


router.post('/:movieId/add', checkUser,(req, res) => {
    tool.checkExistingInTable("movies", req.params.movieId).then((result) => {
        let userData = returnJWTData(req.headers.authorization);
        if (!userData) {
            res.status(400).json({
                message: "error occurred",
                error: "Your token is not valid"
            });
            return;
        }
        tool.executeQuery(`
        select * 
        from shows s 
        join tickets t on t.id_show=s.id
        where t.id_user =${userData.id} and s.id_movie = ${req.params.movieId}
        `).then((result) => {
            if (result.rowCount !== 0) {
                tool.executeQuery(`
                                INSERT INTO ratings(stars, review, id_user, id_movie)
                                VALUES(${req.body.stars}, '${req.body.review}', ${userData.id}, ${req.params.movieId})
                            `).then((result) => {
                    res.status(200).json({
                        message: "review added"
                    });
                }).catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        message: "error occurred",
                        error: err
                    });
                })
            } else {
                res.status(400).json({
                    message: "error occurred",
                    error: `${userData.id} has never saw the movie with id=${req.params.movieId}`
                });
            }
        }).catch(
            (err) => {
                res.status(400).json({
                    message: "error occurred",
                    error: err
                });
            }
        )
    })
});


module.exports = router;