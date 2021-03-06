const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');


// ES6 promises for mongoose
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('../config');
const {BoardGame} = require('../models');


var jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  BoardGame
    .find()
    .then(boardGames => {
      res.json({
        boardGames: boardGames.map(
          (boardGame) => boardGame.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', bodyParser, (req, res) => {
  BoardGame
  console.log('req.params.id = ' + req.params.id)
    .findById(req.params.id)
    .then(boardGame =>res.json(boardGame.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
})

router.post('/', (req, res) => {

  const requiredFields = ['name'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BoardGame
    .create(
      {
        name: req.body.name,
        type: req.body.type,
        players: req.body.players,
        genre: req.body.genre,
        plays: req.body.plays
      }
    )
    .then(
      boardGame => res.status(201).json(boardGame.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', jsonParser, (req, res) => {
 if (req.params.id !== req.body.id) {
   const message = (
     `*****request path id (${req.params.id}) and request body id
     (${req.body.id}) must match*****`);
   console.error(message + '-----req.body is ' + JSON.stringify(req.body.id));
   res.status(400).json({message: message});
 }
 
 const toUpdate = {};
 const updatableFields = ['plays', 'scores', 'wins'];
 updatableFields.forEach(field => {
   if (field in req.body) {
     toUpdate[field] = req.body[field];
   }
 });
console.log(toUpdate);
 BoardGame
  .findByIdAndUpdate(req.params.id, {$push: toUpdate})
  .then(boardGame => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
  BoardGame
    .findByIdAndRemove(req.params.id)
    .then(boardGame => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;
