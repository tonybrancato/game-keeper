const mongoose = require('mongoose');

// this is our schema to represent a Board Game
const boardGameSchema = mongoose.Schema({
  name: {type: String, required: true},
  players: {
    min: Number,
    max: Number
  },
  genre: {type: String, required: true},
  // grades will be an array of objects
  plays: [{
    date: Date,
    players: Number,
  }]
});

const BoardGame = mongoose.model('BoardGame', boardGameSchema);

module.exports = {BoardGame};