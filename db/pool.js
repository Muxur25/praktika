const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	password: '1234567',
	database: 'gulDokon',
	host: 'localhost',
})

module.exports = pool
