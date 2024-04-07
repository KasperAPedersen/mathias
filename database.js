if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let mysql = require('mysql2');

let mySqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = mySqlPool;