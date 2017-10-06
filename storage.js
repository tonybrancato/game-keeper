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