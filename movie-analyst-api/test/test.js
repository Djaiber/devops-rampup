process.env.NODE_ENV = 'test';

// Import dev-dependencies using ES6 syntax
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';  // ← Add .js extension for ES modules

/*legacy code for requiring the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();*/

const should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('API', () => {

/*
  * Test the /GET route
  */
  describe('/GET home', () => {
      it('it should GET any reply', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
              if(err){
                done(err);
              }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('service_status').eql('Up');
              done();
            });
      });
  });

});

  /*
    * Test the /GET movies route
    */
  describe('/GET movies', () => {
      it('it should GET all movies', (done) => {
        chai.request(server)
          .get('/movies')
          .end((err, res) => {
            if (err) {
              done(err);
              return;
            }
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });
    });

  /*
  * Test the /GET reviewers route
  */
   describe('/GET reviewers', () => {
    it('it should GET all reviewers', (done) => {
      chai.request(server)
        .get('/reviewers')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
  /*
  * Test the /GET publications route
  */
   describe('/GET publications', () => {
    it('it should GET all publications', (done) => {
      chai.request(server)
        .get('/publications')
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });