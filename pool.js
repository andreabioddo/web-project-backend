const { Pool } = require('pg');

let cfg = require('./config.json')

let pool = new Pool({
    host: cfg.database.host,
    user: cfg.database.user,
    password: cfg.database.password,
    database: cfg.database.db
});

module.exports = pool;