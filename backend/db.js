const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'AlphaGMAO',
  user: 'admin',
  password: 'LMcontra!',
});

module.exports = pool;
