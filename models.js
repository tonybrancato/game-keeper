const mongoose = require('mongoose');

// this is our schema to represent a Board Game
const boardGameSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  players: {
    min: Number,
    max: Number
  },
  genre: {type: String, required: true},
  plays: [{
    date: String,
    players: Number,
  }]
}); 

boardGameSchema.virtual('numOfPlayers').get(function() {
  if (`${this.players.min}` === `${this.players.max}`) {
    return `${this.players.min}`;
  }
  else 
  return `${this.players.min} to ${this.players.max}`.trim()});

boardGameSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.name,
    type: this.type,
    players: this.numOfPlayers,
    plays: this.plays.length,
    lastPlay: this.lastPlayDate,
  };
}

const BoardGame = mongoose.model('BoardGame', boardGameSchema);

module.exports = {BoardGame};