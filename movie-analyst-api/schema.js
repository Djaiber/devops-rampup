// schema.js
// Script to create the database schema
// include dotenv to load environment variables
import dotenv from 'dotenv'; // <-- FIX: Use import new syntax ES Modules
dotenv.config(); // Still call config() after importing

// Updated to use mysql2/promise for async/await support
import mysql from 'mysql2/promise';

//const util = require('util')

async function createTables() {
  try {
    const pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'applicationuser',
      password: process.env.DB_PASS || 'applicationuser',
      database: process.env.DB_NAME || 'movie_db'
    })
  /* No need to promisify when using mysql2 */
  // pool.query = util.promisify(pool.query)

    // Create publications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS publications (
        name VARCHAR(255) PRIMARY KEY,
        avatar VARCHAR(255)
      )
    `)

    // Create reviewers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviewers (
        name VARCHAR(255) PRIMARY KEY,
        publication VARCHAR(255),
        avatar VARCHAR(255),
        FOREIGN KEY (publication) REFERENCES publications(name)
      )
    `)

    // Create movies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        release_year INT,
        score INT,
        reviewer VARCHAR(255),
        publication VARCHAR(255),
        FOREIGN KEY (reviewer) REFERENCES reviewers(name),
        FOREIGN KEY (publication) REFERENCES publications(name)

      )
    `)

    console.log('Tables created successfully')
    pool.end()
    process.exit(0)
  } catch (err) {
    console.error('Schema creation error:', err)
    process.exit(1)
  }
}

createTables()