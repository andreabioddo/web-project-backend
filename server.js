let cfg = require('./config.json')

let express = require('express');
let cors = require('cors')
const app = express();
app.use(express.static('public')); // host public folder
app.use(cors()); // allow all origins -> Access-Control-Allow-Origin: *

const pool = require('./pool.js');

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies

const checkAuth = require('./check_auth');

const userRoute = require('./user');
app.use("/user", userRoute);

const movieRoute = require('./movie');
app.use("/movie", movieRoute);

const theaterRoute = require('./theater');
app.use("/theater", theaterRoute);

const loginRoute = require('./login');
app.use("/login", loginRoute);

// get products for logged in user as a list of JSON entries
app.get("/testuser", checkAuth.checkUser ,(req, res) => {
    res.status(200).send("Everything is working!");
});

app.get("/testadmin", checkAuth.checkAdmin ,(req, res) => {
    res.status(200).send("Everything is working!");
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);