const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
// ES6 promises for mongoose
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BoardGame} = require('./models');

const app = express();
app.use(bodyParser.json());

//app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/board-games', (req, res) => {
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

app.post('/board-games', (req, res) => {

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

app.put('/board-games/:id', (req, res) => {
 if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
   const message = (
     `request path id (${req.params.id}) and request body id
     (${req.body.id}) must match`);
   console.error(message);
   res.status(400).json({message: message});
 }
 
 const toUpdate = {};
 const updatableFields = ['name', 'plays'];

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

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};