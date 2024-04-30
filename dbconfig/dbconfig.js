const Pool = require('mysql');

const pool = new Pool({
    user: 'admin',
    host: 'ccldb.cv4oagoqevyh.us-east-1.rds.amazonaws.com',
    database: 'ccldb',
    password: 'YDArchu77',
    port: 3306
});

module.exports = pool;
