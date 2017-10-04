const GAMES_URL = '/api-board-games';

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
  handleGameAdd();
});