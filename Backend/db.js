const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'beyoglurehber',
    password: 'postgres',
})

module.exports = client