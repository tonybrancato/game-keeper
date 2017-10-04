const GAMES_URL = '/api-board-games';

let boardGameTemplate = (
  '<div class="game-box js-bgame">' +
    '<h3 class="js-bgame-name"><h3>' +
    '<hr>' +
    '<div class="bgame-controls">' +
      '<button class="js-bgame-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</div>'
);

function getAndDisplayBoardGames() {
  console.log('Retrieving Board Games')
  $.getJSON(GAMES_URL, function(boardGames) {
    console.log('Rendering Board Game Library');
    let boardGameElements = boardGames.map(function(boardGame) {
      let element = $(boardGameTemplate);
      element.attr('id', boardGame.id);
      element.find('.js-bgame-name').text(boardGame.name);
      return element;
    });
    $('.game-box').html(boardGameElements)
  });
}

function addGame(game) {
  console.log('Adding game: ' + game);
  $.ajax({
    method: 'POST',
    url: GAMES_URL,
    data: JSON.stringify(game),
    success: function(data) {
      $.ajax({
        method: 'GET',
        url: '/',
        data: '',
        success: function(data) {
          $('.modal-input').val("");
          $.modal.close();
        }
      });
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


function handleGameAdd () {
  $('#addGameForm').submit(function(e) {
    e.preventDefault();
    addGame({
      name: $(e.currentTarget).find('#game-name').val(),
      genre: $(e.currentTarget).find('#genre').val()
    });
  });
}


// ready function, for page load
$(function() {
  getAndDisplayBoardGames();
  handleGameAdd();
});