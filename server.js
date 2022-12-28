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

const loginRoutes = require('./login');
app.use("/login", loginRoutes);

// get products for logged in user as a list of JSON entries
app.get("/", (req, res) => {
	res.setHeader('Content-Type', 'text/html');
    res.status(200).send("EX4: This is a database-backed application which uses JWT");
});

/**Method that run a query on pg and return a promise with the result of the query */
function executeSelectQuery(sqlQuery) {
    return new Promise((resolve, reject) => {
        console.log("QUERY:" + sqlQuery);
        pool.query(sqlQuery, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/** If the user is logged, return a list of id of the products*/
app.get("/users",checkAuth, (req, res) => {
    
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:"+port);
