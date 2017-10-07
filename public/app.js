const GAMES_URL = '/api-board-games';

function makeBoardGame(id, name, players, plays) {
  return (
    `<div class="js-bgame" id="${id}">
      <h3 class="js-bgame-name">${name}</h3>
      <h4 class="js-bgame-players">Players: ${players}</h4>
      <h4 class="js-bgame-plays">Total Plays: ${plays}</h4>
      <div class="bgame-controls">
        <button class="js-bgame-delete">
          <span class="button-label">delete</span>
        </button>
      </div> 
    </div>`
  );
}

// retrieve games from the db and display each of them in their
// own box in the DOM. 
function getAndDisplayBoardGames() {
  console.log('Retrieving Board Games')
  $.getJSON(GAMES_URL, function(result) {
    console.log('Rendering Board Game Library');
    // console.log(result.boardGames);
      let element = result.boardGames;
      console.log(element)
    // let testGame = makeBoardGame(result.boardGames[0].id, result.boardGames[0].name);
    // // console.log(testGame);
     let boardGameElements = $(element).map(function(i) {
      return makeBoardGame(element[i].id, element[i].name, element[i].players, element[i].plays);
     }).get();
     console.log(boardGameElements);
     $('.game-box').html(boardGameElements); 
  }); 

}

function addGame(game) {
  console.log('Adding game: ' + game);
  $.ajax({
    method: 'POST',
    url: GAMES_URL,
    data: JSON.stringify(game),
    success: function(data) {
      $('.modal-input').val("");
      location.reload();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function updateGame(game) {
  console.log('updating game with' + game);
  $.ajax({
    method: 'PUT',
    url: GAMES_URL,
    data: JSON.stringify(game),
    success: function(data) {
      
    }
  })
}

function deleteGame(gameId) {
  console.log(`deleting ${gameId} from database`)
  $.ajax({
    method: 'DELETE',
    url: GAMES_URL + '/' + gameId,
    success: getAndDisplayBoardGames
  });
}

function handleGameAdd () {
  $('#addGameForm').submit(function(e) {
    e.preventDefault();
    addGame({
      name: $(e.currentTarget).find('#game-name').val(),
      genre: $(e.currentTarget).find('#genre').val(),
      players: {
        min: $(e.currentTarget).find('#numPlayersMin').val(),
        max: $(e.currentTarget).find('#numPlayersMax').val(),
      }
    });
  });
}

function handleGameDelete () {
  $('body').on('click', '.js-bgame-delete', (function(e) {
    e.preventDefault();
    deleteGame($(e.currentTarget).closest('.js-bgame').attr('id'));
  }));
}
// ready function, for page load
$(function() {
  getAndDisplayBoardGames();
  handleGameAdd();
  handleGameDelete();
});