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
  


username: $(e.currentTarget).find('#new-username').val(),
password: $(e.currentTarget).find('#password').val(),
email: $(e.currentTarget).find('#email').val(),
firstName: $(e.currentTarget).find('#first-name').val(),
lastName: $(e.currentTarget).find('#last-name').val()

      var username = $('#new-username').val();
      var password = $('#password').val();
      var email = $('#email').val();
      var firstName = $('#first-name').val();
      var lastName = $('#last-name').val();