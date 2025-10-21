// Get our dependencies
import dotenv from 'dotenv';
dotenv.config(); // Still call config() after importing
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
/* legacy module syntax
require('dotenv').config();
const express = require('express')
const app = express()
const mysql = require('mysql')
const util = require('util')
*/
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'applicationuser',
  password: process.env.DB_PASS || 'applicationuser',
  database: process.env.DB_NAME || 'movie_db'

})
//pool.query = util.promisify(pool.query)

// Implement the movies API endpoint
app.get('/movies', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release_year, m.score, r.name as reviewer, p.name as publication from movies m,' +
      'reviewers r, publications p where r.publication=p.name and m.reviewer=r.name'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/reviewers', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/publications', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/pending', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release, m.score, r.name as reviewer, p.name as publication' +
      'from movie_db.movies m, movie_db.reviewers r, movie_db.publications p where' +
      'r.publication=p.name and m.reviewer=r.name and m.release>=2017'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})


app.get('/', function (req, res) {
  res.status(200).send({'service_status': 'Up'})
})

/* Start the server only if not in test mode (Wrapper to allow testing)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000   
  app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT)
  })
}*/


//change test mode to export app without listening
console.log('server listening through port: ' + (process.env.PORT || 3000))
app.listen(process.env.PORT || 3000)

//legacy module export syntax
//module.exports = app

// ES Module export syntax
export default app