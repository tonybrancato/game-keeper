const AUTH_URL = '/api/auth';

function authInput(user) {
  console.log('authenticating user: ' + user);
  $.ajax({
    method: 'POST',
    url: USERS_URL,
    headers: {
      authorization: 'Basic ' + '' 
    },
    data: JSON.stringify(user),
    success: function(data) {
      $('.modal-input').val("");
      location.reload();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}