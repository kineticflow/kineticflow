// Auth JS

$(document).ready(function() {

  // Let people log in
  $("#logInForm").submit(function(e) {
    e.preventDefault();
    $("#logInButton").html('<i class="fa fa-spinner fa-spin"></i>');
    var email = $.trim($('#logInEmail').val());
    var password = $.trim($('#logInPassword').val());
    firebase.auth().signInWithEmailAndPassword(email, password).then(
      function(snapshot){
        $("#logInEmail").val('');
        $("#logInPassword").val('');
        $("#logInButton").html('Log In');
      },
      function(error) {
        $("#logInButton").html('Log In');
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
      }
    );
  });

  // Let people log out
  $(".log-out-button").click(function() {
    var outboundUser = firebase.auth().currentUser.email;
    firebase.auth().signOut().then(function() {
        // The user logs out!
        $(".mobile-menu").fadeOut();
        console.log(outboundUser + "logged out");
      }, function(error) {
        // An error happened.
        console.log("Error! "+ errorMessage);
    });
  });

});
