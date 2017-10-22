const GAMES_URL = '/api/board-games';

// Retrieve games from the db and display each of them in their
// own box in the DOM. 
function getAndDisplayBoardGames() {
  $.getJSON(GAMES_URL, function(result) {
  	let element = result.boardGames;
    let boardGameElements = $(element).map(function(i) {
     return makeBoardGame(element[i].id, element[i].name, element[i].type, element[i].players, element[i].plays);
    }).get();
		$('.game-box').html(boardGameElements); 
		$('.js-bgame').velocity("transition.swoopIn", { duration: 600, stagger: 100 })
  }); 
}

// ADD GAMES
function makeBoardGame(id, name, type, players, plays) {
  return (
    `<div class="col-3">
      <div class="js-bgame" id="${id}">
        <h3 class="js-bgame-name game-name"><span class="name-text">${name}</span></h3>
        <div class="${type}"></div>
        <div class="js-bgame-info">
          <p class="js-bgame-players">Players: ${players}</p>
          <p class="js-bgame-plays">Total Plays: ${plays}</p>
        </div>
        <div class="bgame-controls">
          <a href="#updatePlayForm" rel="modal:open" class="link-btn js-new-play">New Play</a>          
          <a href="#deleteGameForm" class="link-btn js-bgame-delete" rel="modal:open">Delete</a>          
        </div> 
      </div>
    </div>`
  );
}

function handleGameAdd () {
  $('#addGameForm').submit(function(e) {
    e.preventDefault();
    const bgame = $(e.currentTarget);
    addGame({
			name: bgame.find('#game-name').val(),
			type: bgame.find('#gameType').val(),
      genre: bgame.find('#genre').val(),
      players: {
        min: bgame.find('#numPlayersMin').val(),
        max: bgame.find('#numPlayersMax').val(),
			}
    });
  });
}

function addGame(game) {
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

// UPDATE GAMES
function updateGame(game) {

  $.ajax({
    "async": true,
    "crossDomain": true,
    "url": GAMES_URL + '/' + game.id,
    "method": "PUT",
   	"headers": {
			"content-type": "application/json"
    },
    "processData": false,
    "data": JSON.stringify(game),
    "success": location.reload(), 
  });

}

// retrieves the game's id on clicking
function handleNewPlay (e) {
  $('body').on('click', '.js-new-play', (function(e) {
    let foo = $(e.currentTarget).closest('.js-bgame').attr('id');
   $('#updatePlayForm').find('input[type=hidden]').val(`${foo}`);
  }));
}

function handleAddPlay () {
  $('#updatePlayForm').submit(function(e) {
    e.preventDefault();
		const bgame = $(e.currentTarget);
    updateGame({
      id: bgame.find('input[type=hidden]').val(),
      plays: {
        date: Date(),
        players: bgame.find('#numGamePlayers').val()
      }
    });
  });
}

// DELETE GAMES 
function findGameToDelete (e) {
  $('body').on('click', '.js-bgame-delete', (function(e) {
    let foo = $(e.currentTarget).closest('.js-bgame').attr('id');
   $('#deleteGameForm').find('input[type=hidden]').val(`${foo}`);
   $('#deleteGameForm').find('h2').text('');
   $('#deleteGameForm').find('h2').append(`Are you sure you want
   to permanently delete this game from the library?`);
  }));
}

function deleteGame(gameId) {
  $.ajax({
    method: 'DELETE',
    url: GAMES_URL + '/' + gameId,
		success: location.reload()
  });
}

function handleGameDelete () {
  $('#deleteGameForm').submit(function(e) {
    e.preventDefault();
		deleteGame(
      $('#deleteGameForm').find('input[type=hidden]').val()
    );
  });
}

// filtering games based on icons at the top
function handleGameFilter() {
	$('html').on('click', '#meeple', (function(e) {
		$('.Board').each(function(){
      $(this).parent().toggle();
      $('#meeple').toggleClass('hidden');
		});
	}));

	$('html').on('click', '#d20', (function(e) {
		$('.TTRPG').each(function(){
      $(this).parent().toggle();
      $('#d20').toggleClass('hidden');
		});
	}));

	$('html').on('click', '#cards', (function(e) {
		$('.Card').each(function(){
      $(this).parent().toggle();
      $('#cards').toggleClass('hidden');
		});
	}));

	$('html').on('click', '#videoGame', (function(e) {
		$('.Video').each(function(){
      $(this).parent().toggle();
      $('#videoGame').toggleClass('hidden');
		});
	}));
}

// ready function, for page load
$(function() {
  getAndDisplayBoardGames();
  handleGameAdd();
  findGameToDelete();
  handleGameDelete();
  handleAddPlay();
  handleGameFilter();
  handleNewPlay();
});