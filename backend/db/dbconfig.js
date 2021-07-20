const env = process.env;
const Pool = require("pg").Pool;

const pool = new Pool({
	host: env.DB_HOST || "localhost",
	port: env.DB_PORT || "5432",
	user: env.DB_USER || "postgres",
	password: env.DB_PASSWORD || "",
	database: env.DB_NAME || "mist",
});
module.exports = pool;
