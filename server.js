const express = require('express');
const cors = require('cors')
const app = express();
const tool = require('./tools');
app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies

const checkAuth = require('./check_auth');

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const movieRoute = require('./routes/movie');
app.use("/movie", movieRoute);

const theaterRoute = require('./routes/theater');
app.use("/theater", theaterRoute);

const loginRoute = require('./routes/login');
app.use("/login", loginRoute);

const reviewRoute = require('./routes/review');
app.use("/review", reviewRoute);

const ticketRoute = require('./routes/ticket');
app.use("/ticket", ticketRoute);

// get products for logged in user as a list of JSON entries
app.get("/testuser", checkAuth.checkUser ,(req, res) => {
    res.status(200).send("Everything is working!");
});

app.get("/testadmin", checkAuth.checkAdmin ,(req, res) => {
    res.status(200).send("Everything is working!");
});

app.get("/updatedb", (req, res) => {
    tool.executeQuery("SELECT * FROM users").then((result) => {
        console.log(result.rows);
        for(let r of result.rows){
            tool.hashText('password').then((result) => {
                console.log(result);
                tool.executeQuery(`
                    UPDATE users 
                    SET password='${result}'
                    WHERE id=${r.id}`
                ).then((result) => {console.log("OK")}).catch((err)=>{console.log(err)})
            })
        }
        res.status(200).send("Everything updated");
    })
})

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);