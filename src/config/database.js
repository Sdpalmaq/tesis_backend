import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// // onexion local con postgres
/*
const pool = new Pool({
host: "localhost",
port: 5432,
 database: "tesis_v2",
 user: "postgres",
 password: "St@0402003602",
});*/
//export default pool;


const pool = new Pool({
  host: "ep-square-term-a8b6ch3u-pooler.eastus2.azure.neon.tech",
  port: 5432,
  database: "neondb",
  user: "neondb_owner",
  password: "npg_TXElGZkCL6g8",
  ssl: { rejectUnauthorized: false } // ⚠️ Esto activa SSL obligatorio
});

export default pool;
