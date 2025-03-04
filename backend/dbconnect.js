const {Pool} = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "pwd",
    host: "localhost",
    port: "5432",
    database: "persona"
})

module.exports = {
    query: (text, params) => pool.query(text, params)
};
