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

// get products for logged in user as a list of JSON entries
app.get("/", (req, res) => {
	res.setHeader('Content-Type', 'text/html');
    res.status(200).send("EX4: This is a database-backed application which uses JWT");
});




let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
