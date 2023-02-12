let tool = require('../tools');
const express = require('express');
const pool = require('../pool');
const { checkUser, checkAdmin } = require('../check_auth');
const router = express.Router();

router.get('/allfeatures', /*checkAdmin,*/ (req, res) => {
    tool.executeQuery(
        'SELECT * FROM features'
    ).then((result) => {
        res.status(200).send(result.rows);
        
    }).catch((err) => {
        console.log("14");
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});

/** Return an array of theaters */
router.get('/', /*checkUser,*/ (req, res) => {
    tool.executeQuery(
        `SELECT * FROM theaters`
    ).then(async (result) => {
        for(let r of result.rows){
            let tmp = await pool.query(`SELECT * FROM seats WHERE id_theater=${r.id}`);
            r.seats = tmp.rows;
            tmp = await pool.query(`
                SELECT f.name, f.id FROM features f 
                JOIN hasfeature hf ON f.id=hf.id_feature
                JOIN theaters t ON t.id=hf.id_theater
                WHERE t.id=${r.id}`
            );
            r.features = tmp.rows;
        }
        res.status(200).send(result.rows);
        
    }).catch((err) => {
        console.log("43");
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});


/** Return a json with the detail of the theater with id=id given as param*/
router.get('/:id', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("theaters", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            return;
        }
    );
    tool.executeQuery(
        `SELECT * FROM theaters WHERE id=${req.params.id}`
    ).then((res1) => {
        tool.executeQuery(
            `SELECT * FROM seats WHERE id_theater=${req.params.id}`
        ).then((res2)=>{
            tool.executeQuery(
                `SELECT f.name, f.id FROM features f 
                JOIN hasfeature hf ON f.id=hf.id_feature
                JOIN theaters t ON t.id=hf.id_theater
                WHERE t.id=${req.params.id}`
            ).then((res3) => {
                let intermediateResult = res1.rows[0];
                intermediateResult.seats = res2.rows;
                intermediateResult.hasFeature = res3.rows;
                res.status(200).send(intermediateResult);
                
            }).catch((err) => {
                res.status(400).json({
                    message: "error occurred",
                    error: err
                });
                
            })
        }).catch((err) => {
            console.log(err);
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});

/**Add an theater taken the details from the body of the request. It return a message and the last id*/
router.post('/add', /*checkAdmin,*/ (req, res) => {
    tool.executeQuery(
        `INSERT INTO theaters (name, number_of_seats)
        VALUES('${req.body.name}', '${req.body.number_of_seats}') 
        RETURNING id`
    ).then((result) => {
        console.log(req.body.features);
        let lastId = result.rows[0].id;
        for(let feature of req.body.features){
            tool.executeQuery(`INSERT INTO hasfeature(id_feature, id_theater) VALUES (${feature}, ${lastId})`).catch(
                (err) => {
                    console.log(err);
                    res.status(400).json({
                        message: "error occurred",
                        error: err
                    });
                    
                }
            )
        }        
        res.status(200).json({
            message: "new theater created",
            lastId: lastId
        });
        
    }).catch((err) => {
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});

router.delete('/:id', /*checkAdmin,*/ (req, res)=>{
    tool.checkExistingInTable("theaters", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            return;
        }
    );
    tool.executeQuery(`DELETE FROM theaters WHERE id=${req.params.id}`)
    .then((result)=>{
        res.status(200).json({
            message:`Theater with id=${req.params.id} DELETED`
        });

    }).catch((err)=>{
        console.log("157");
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
    })
});

router.put('/:id', /*checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("theaters", req.params.id).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            return;
        }
    );
    tool.executeQuery(
        `UPDATE theaters
        SET name='${req.body.name}', number_of_seats='${req.body.number_of_seats}'
        WHERE id=${req.params.id}`
    ).then((result)=>{
        tool.executeQuery(`DELETE FROM hasfeature WHERE id_theater=${req.params.id}`).catch((err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            
        });
        for(let feature of req.body.features){
            tool.executeQuery(`INSERT INTO hasfeature(id_feature, id_theater) VALUES (${feature}, ${req.params.id})`).catch(
                (err) => {
                    res.status(400).json({
                        message: "error occurred",
                        error: err
                    });
                    
                }
            )
        }
        res.status(200).json({
            messsage:`Theater with id=${req.params.id} UPDATED`
        });
        
    }).catch((err)=>{
        console.log("187");
        console.log(err);
        res.status(400).json({
            messsage:"An error occurred",
            error:err
        });
        
    })
});

router.post('/:theaterId/addseat', /*checkAdmin,*/ (req, res) => {
    tool.checkExistingInTable("theaters", req.params.theaterId).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            return;
        }
    );
    tool.executeQuery(
        `INSERT INTO seats (number, row, type, removable, id_theater)
        VALUES(${req.body.number}, ${req.body.row}, '${req.body.type}', ${req.body.removable}, ${req.params.theaterId})`
    ).then((result)=>{
        res.status(200).json({
            message:"Seats added"
        });
        
    }).catch((err)=>{
        console.log("207");
        console.log(err);
        res.status(400).json({
            messsage:"An error occurred",
            error:err
        });
        
    })
});

router.delete('/:theaterId/removeseat/:seatId', /*checkAdmin,*/ (req, res)=>{
    tool.executeQuery(
        `SELECT * FROM seats WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`
    ).then((result) => {
        if(result.rowCount <= 0){
            res.status(400).json({
                message: "error occurred",
                error: `No seat with id=${req.params.seatId} and id_theater=${req.params.theaterId} found`
            });
            
        }
        tool.executeQuery(`DELETE FROM seats WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`)
        .then((result)=>{
            console.log(`2. SELECT * FROM seats WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`);
            res.status(200).json({
                message:`seat with id=${req.params.seatId} and id_theater=${req.params.theaterId} DELETED`
            });
            
        }).catch((err)=>{
            console.log("235");
            console.log(err);
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            
        })
    }).catch((err)=>{
        console.log("244");
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});

router.put('/:theaterId/updateseat/:seatId', /*checkAdmin,*/ (req, res) => {
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
        tool.executeQuery(`UPDATE seats SET  type='${req.body.type}', removable=${req.body.removable} WHERE id=${req.params.seatId} AND id_theater=${req.params.theaterId}`)
        .then((result)=>{
            res.status(200).json({
                message:`seats with id=${req.params.seatId} and id_theater=${req.params.theaterId} UPDATED`
            });
            return;
        }).catch((err)=>{
            console.log("272");
            console.log(err);
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            
        })
    }).catch((err)=>{
        console.log("281");
        console.log(err);
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});


router.get('/seats/:theaterId', /*checkUser,*/ (req, res) => {
    tool.checkExistingInTable("theaters", req.params.theaterId).catch(
        (err) => {
            res.status(400).json({
                message: "error occurred",
                error: err
            });
            return;
        }
    );
    tool.executeQuery(
        `SELECT * FROM seats WHERE id_theater=${req.params.theaterId}`
    ).then((res1)=>{
        res.status(200).send(res1.rows);
        
    }).catch((err)=>{
        res.status(400).json({
            message: "error occurred",
            error: err
        });
        
    })
});

module.exports = router;