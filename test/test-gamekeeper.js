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
    genre: faker.commerce.color(),
    players: {
      min: 2,
      max: 4
    }
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

describe('GameKeeper API resource', function() {

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

  it('should show a 200 status', function() {

    // test strategy:
    // 1. make a request to /api/board-games
    // 2. inspect response object and prove it has the right code and have
    // correct keys in response.
    
  // GET
    let res;
    return chai.request(app)
      .get('/api/board-games')
      .then(function(_res) {
        res = _res;
        console.log(res.body.boardGames)
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');        
        res.body.boardGames.length.should.be.at.least(1);
        const expectedKeys = ['id', 'name', 'type', 'players', 'plays'];
        res.body.boardGames.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });      
      });
  });

  // POST

    it('should add a new game on POST', function() {
      const newGame = generateBoardGameData();
      return chai.request(app)
        .post('/api/board-games')
        .send(newGame)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.id.should.not.be.null;
          res.body.id.should.not.be.undefined;
          res.body.type.should.equal(newGame.type);
          res.body.name.should.equal(newGame.name);
          return BoardGame.findById(res.body.id);
        })
        .then(function(game) {
         game.name.should.equal(newGame.name);
         game.type.should.equal(newGame.type);
         game.genre.should.equal(newGame.genre);
         
        })
    });
  
  // PUT

  it('should update items on PUT', function() {

    const updateData = {
      plays: {
        date: faker.date.past(),
        players: faker.random.number({min:1, max:99})
      }
    };

    return chai.request(app)
      .get('/api/board-games')
      .then(function(res) {
        updateData.id = res.body.boardGames[0].id;
        return chai.request(app)
          .put(`/api/board-games/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
        res.request._data.should.be.a('object');
        res.request._data.should.deep.equal(updateData);
      });
  });

  // DELETE 
  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/api/board-games')
      .then(function(res) {
        return chai.request(app)
          .delete(`/api/board-games/${res.body.boardGames[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
