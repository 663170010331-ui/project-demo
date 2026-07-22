import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

export const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err)
})

export const query = (text, params) => pool.query(text, params)
