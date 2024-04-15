import 'dotenv/config.js'
import mysql from 'mysql2';
let db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: false
}).promise();

export function get(_sql, _values) {
    return db.query(_sql, _values);
}

export async function set(_sql, _values) {
    let res = db.query(_sql, _values);
    return res;
}