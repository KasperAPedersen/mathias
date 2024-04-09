if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let mysql = require('mysql2');

let mySqlPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mathias',
    multipleStatements: false
});

module.exports = mySqlPool;