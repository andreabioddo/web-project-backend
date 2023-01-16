let tool = require('./tools');
const express = require('express');
const router = express.Router();
const checkAuth = require('./check_auth');

//Add Middleware with authrequest

router.get('/:movieId', (req, res) => {    
    tool.executeQuery(`
        SELECT u.id as userid, u.name, r.stars, r.review FROM ratings as r 
        JOIN users as u ON u.id=r.id_user
        WHERE id_movie=${req.params.movieId}
    `).then((result) => {
        res.status(200).send(
            result.rows
        );
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});


router.post('/:movieId/add', (req, res) => {
    let userData = checkAuth.returnJWTData(req.headers.authorization);
    tool.executeQuery(`
        INSERT INTO ratings(stars, review, id_user, id_movie)
        VALUES(${req.body.stars}, '${req.body.review}', ${userData.id}, ${req.params.movieId})
    `).then((result) => {
        res.status(200).json({
            message:"review added"
        });
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});


module.exports = router;