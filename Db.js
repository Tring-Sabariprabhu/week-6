const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');  // Importing pg module and using Pool

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',      // PostgreSQL username
    password: 'pwd',       // PostgreSQL password
    host: 'localhost',      // Database host (local machine)
    port: 5432,             // Default PostgreSQL port
    database: 'HMS'  // Database name
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
