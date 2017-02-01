// App JS

$(document).ready(function() {

  // Firebase is initialised in index.html

  // But what day is it?!
  var date  = new Date();
  var today = (date.toDateString());

  // Global variables... The horror.

  var currentUser;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $(".user-logged-out").hide();
      $(".user-logged-in").fadeIn();
      var currentUser = user.uid;
      console.log(currentUser);
      $(".user-email").html(user.email);
    } else {
      $(".user-logged-in").hide();
      $(".user-logged-out").fadeIn();
      var currentUser = "Nobody!";
      console.log(currentUser);
      $(".user-email").html('');
    }
  });

});
