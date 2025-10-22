// Load environment variables from .env file
import dotenv from 'dotenv'; 
dotenv.config(); 
// Declare our dependencies
import express from 'express';
import request from 'superagent';
//var express = require('express'); legacy mode 
//var request = require('superagent'); legacy mode

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname is not available in ES modules, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create our express app
const app = express();

// Set the view engine to use EJS as well as set the default views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

// This tells Express out of which directory to serve static assets like CSS and images
app.use(express.static(__dirname + '/public'));

let backend_url = process.env.BACKEND_URL || "http://localhost:3000"

// The homepage route of our application does not interface with the MovieAnalyst API and is always accessible. We won’t use the getAccessToken middleware here. We’ll simply render the index.ejs view.
app.get('/', function(req, res){
  res.render('index');
})

// For the movies route, we’ll call the getAccessToken middleware to ensure we have an access token. If we do have a valid access_token, we’ll make a request with the superagent library and we’ll be sure to add our access_token in an Authorization header before making the request to our API.
// Once the request is sent out, our API will validate that the access_token has the right scope to request the /movies resource and if it does, will return the movie data. We’ll take this movie data, and pass it alongside our movies.ejs template for rendering
app.get('/movies', function(req, res){
  request
    .get(`${backend_url}/movies`)
    .end(function(err, data) {
      if(err || data.status == 403){
        res.status(403).send('403 Forbidden');
      } else {
        const movies = data.body;
        res.render('movies', { movies: movies} );
      }
    })
})

// The process will be the same for the remaining routes. We’ll make sure to get the acess_token first and then make the request to our API to get the data.
// The key difference on the authors route, is that for our client, we’re naming the route /authors, but our API endpoint is /reviewers. Our route on the client does not have to match the API endpoint route.
app.get('/authors', function(req, res){// ← Frontend route is /authors
  request
    .get(`${backend_url}/reviewers`) // ← Backend endpoint is /reviewers
    //.set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(err || data.status == 403){
        res.status(403).send('403 Forbidden');
      } else {
        const authors = data.body;
        res.render('authors', {authors : authors});
      }
    })
})

app.get('/publications', function(req, res){
  request
    .get(`${backend_url}/publications`)
    .end(function(err, data) {
      if(err ||data.status == 403){
        res.status(403).send('403 Forbidden');
      } else {
        const publications = data.body;
        res.render('publications', {publications : publications});
      }
    })
})

// We’ve added the pending route, but calling this route from the MovieAnalyst Website will always result in a 403 Forbidden error as this client does not have the admin scope required to get the data.
app.get('/pending', function(req, res){
  request
    .get(`${backend_url}/pending`)
    .end(function(err, data) {
      if(err || data.status == 403){
        res.status(403).send('403 Forbidden');
      }
    })
})

app.listen(process.env.PORT || 3030);