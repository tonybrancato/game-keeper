const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {BoardGame} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function generateBoardGameData() {
  return {
    name: faker.commerce.productName(),
    type: faker.commerce.productMaterial(),
    genre: faker.commerce.color()
 }
}

function seedBoardGameData() {
  console.info('seeding board game data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBoardGameData());
  }
  // this will return a promise
  return BoardGame.insertMany(seedData);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('BoardGames API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBoardGameData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

describe('GET endpoint', function() {

    it('should show a 200 status', function() {

      let res;
      return chai.request(app)
        .get('/api/board-games')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);

          // should retrieve all board game

          /*res.body.should.have.length.of.at.least(1);          
          return BoardGame.count();
          })
          .then(function(count) {
            res.body.should.have.length.of(count);
          */});
        });
    });
  
  // POST

  // PUT

  // DELETE

});
