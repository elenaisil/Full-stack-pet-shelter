const { Pool } = require('pg');
const path = require('path')
require('dotenv').config({path: path.join(__dirname, '../.env')});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// test the connection
pool.connect()
    .then(() => console.log('connected to PostgreSQL successfully!'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;

