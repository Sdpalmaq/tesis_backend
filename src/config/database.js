import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

//const pool = new Pool({
//  host: "kesavan.db.elephantsql.com",
//  port: 5432,
//  database: "rvpkczjr",
//  user: "rvpkczjr",
//  password: "gItECzAW6G00yA6faJs18VQ2vgCB8YHv",
//});

// conexion local con postgres
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "tesis_v2",
  user: "postgres",
  password: "St@0402003602",
});
export default pool;