const GAMES_URL = '/api/board-games';

function makeBoardGame(id, name, type, players, plays) {
	console.log(id, name, type, players, plays);
  return (
    `<div class="js-bgame col" id="${id}">
			<h3 class="js-bgame-name game-name"><span class="name-text">${name}</span></h3>
			<div class="${type}"></div>
      <div class="js-bgame-info">
        <p class="js-bgame-players">Players: ${players}</p>
        <p class="js-bgame-plays">Total Plays: ${plays}</p>
      </div>
      <div class="bgame-controls">
				<a href="#updatePlayForm" rel="modal:open" class="link-btn span_5_of_12 js-new-play">New Play</a>          
				<a href="#" class="link-btn span_5_of_12 js-bgame-delete">Delete</a>          
      </div> 
    </div>`
  );
}

// retrieve games from the db and display each of them in their
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

function addGame(game) {
	console.log(JSON.stringify(game));
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
  console.log('updating game with' + JSON.stringify(game));
  console.log(GAMES_URL + '/' + game.id);
  $.ajax({
		async: true,
    method: 'PUT',
    url: GAMES_URL + '/' + game.id,
		headers: {
			contentType: 'application/json'
		},    
    data: JSON.stringify(game),
     success: getAndDisplayBoardGames
  });
}
// can I log the id of the game to the console?
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
		console.log((bgame).find('input[type=hidden]').val());
    updateGame({
      id: bgame.find('input[type=hidden]').val(),
      plays: {
        date: Date(),
        players: bgame.find('#numGamePlayers').val()
      }
    });
  });
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

// function displayLastPlayedGame () {
	
// }

// function handleGameDelete () {
//   $('body').on('click', '.js-bgame-delete', (function(e) {
//     e.preventDefault();
// 		deleteGame($(e.currentTarget).closest('.js-bgame').attr('id'),
// 		$(this).velocity("transition.swoopOut", { duration: 750 })
// );
//   }));
// }



// filtering games based on icons at the top
function handleGameFilter() {
	$('header').on('click', '#meeple', (function(e) {
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
  // handleGameDelete();
  handleAddPlay();
  handleGameFilter();
  handleNewPlay();
});