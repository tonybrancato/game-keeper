const GAMES_URL = '/board-games';

function addGame(game) {
  console.log('Adding game: ' + game);
  $.ajax({
    method: 'POST',
    url: GAMES_URL,
    data: JSON.stringify(game),
    success: function(data) {
      alert('successfully added game');
    },
    dataType: 'json',
    contentType: 'application/json'
  });
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

$(function() {
  handleGameAdd();
});