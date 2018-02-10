const mongoose = require('mongoose');
const moment = require('moment');

// this is our schema to represent a Board Game
const boardGameSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  players: {
    min: {type: Number, required: true},
    max: {type: Number, required: true},
    type: Object
  },
  genre: {type: String, required: true},
  plays: [{
    date: String,
    players: Number,
  }],
  scores: Array,
  wins: Array
}); 

boardGameSchema.virtual('numOfPlayers').get(function() {
  if (`${this.players.min}` === `${this.players.max}`) {
    return `${this.players.min}`;
  }
  else 
  return `${this.players.min} to ${this.players.max}`.trim()});

boardGameSchema.virtual('averageScore').get(function() {
  if (this.scores.length > 0) {
    const scores = this.scores.map(Number);
    return `${Math.floor((scores.reduce((x, y) => x + y)) / scores.length)}`;    
  }
  else
    return 'N/A';
})

boardGameSchema.virtual('winsAndLosses').get(function() {
  if (this.wins.length > 0) {
    const wins = this.wins.map(Number);
    const totalWins = wins.reduce((x, y) => x + y);
    const totalLosses = this.wins.length - totalWins;
    console.log(totalWins, totalLosses);
    return `Wins: ${totalWins} Losses: ${totalLosses}`;
  }
  else
  return `Wins: N/A Losses: N/A`;
})

boardGameSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    name: this.name,
    type: this.type,
    players: this.numOfPlayers,
    plays: this.plays.length,
    averageScore: this.averageScore,
    lastPlay: this.lastPlayDate,
    winsAndLosses: this.winsAndLosses
  };
}

const BoardGame = mongoose.model('BoardGame', boardGameSchema);

module.exports = {BoardGame};