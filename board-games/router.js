const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// ES6 promises for mongoose
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('../config');
const {BoardGame} = require('../models');

const app = express();

router.get('/', (req, res) => {
  BoardGame
    .find()
    .limit(10)
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

router.get('/:id', (req, res) => {
  BoardGame
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
    .create({
      name: req.body.name,
      players: req.body.players,
      genre: req.body.genre,
      plays: req.body.plays})
    .then(
      boardGame => res.status(201).json(boardGame.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {
 if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
   const message = (
     `request path id (${req.params.id}) and request body id
     (${req.body.id}) must match`);
   console.error(message);
   res.status(400).json({message: message});
 }
 
 const toUpdate = {};
 const updatableFields = ['plays'];

 updatableFields.forEach(field => {
   if (field in req.body) {
     toUpdate[field] = req.body[field];
   }
 });

 BoardGame
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
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
