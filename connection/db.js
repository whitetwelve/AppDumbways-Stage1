const { Pool } = require('pg');

const dbPool = new Pool({
    database: 'dumbways',
    port: '5022',
    user: 'postgres',
    password: 'root',
});

module.exports = dbPool;