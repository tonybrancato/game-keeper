const USERS_URL = '/api/users';

// adding a user POST
function addUser(user) {
  console.log('Adding user: ' + user);
  $.ajax({
    method: 'POST',
    url: USERS_URL,
    headers: {
      username: 'username',
      password: 'password'
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

function handleUserAdd () {
  $('#signUpForm').submit(function(e) {
    e.preventDefault();
    addUser({
      username: $(e.currentTarget).find('#new-username').val(),
      password: $(e.currentTarget).find('#new-password').val(),
      email: $(e.currentTarget).find('#email').val(),
      firstName: $(e.currentTarget).find('#first-name').val(),
      lastName: $(e.currentTarget).find('#last-name').val()
    });
  });
}



$(function(){
  handleUserAdd();
});