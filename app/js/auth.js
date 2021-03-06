// Auth JS

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
      var errorMessage;
      if (errorCode == "auth/invalid-email") {
        errorMessage = "Email address incorrectly formatted";
      } else if (errorCode == "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorCode == "auth/user-not-found") {
        errorMessage = "A user with email " + email + " does not exist.";
      }
      $("#logInAlert").stop(true, true);
      $("#logInAlert .alert-message").html(errorMessage);
      $("#logInAlert").fadeIn("fast").delay(6000).fadeOut("slow");
      console.log(errorCode + " " + errorMessage);
    }
  );
});

// Let people log out
$(".log-out-button").click(function() {
  resetAudioPlayer();
  $(".admin-tabs").hide();
  var outboundUser = firebase.auth().currentUser.email;
  firebase.auth().signOut().then(function() {
      // The user logs out!
      changeView('#mindfulness');
      $(".menu").hide('fast');
      $('.menu-icon').toggleClass('rotate180');
      $(".mobile-menu").fadeOut();
    }, function(error) {
      // An error happened.
      console.log("Error! "+ errorMessage);
  });
});

// Let people reset a forgotten password
$("#forgotPasswordLink").click(function(){
  $("#logInForm").hide();
  $("#forgotPasswordForm").fadeIn();
});

$("#forgotBack").click(function(){
  $("#forgotPasswordForm").hide();
  $("#logInForm").fadeIn();
});

$("#forgotPasswordForm").submit(function(e) {
  e.preventDefault();
  $("#forgotPasswordButton").html('<i class="fa fa-spinner fa-spin"></i>');
  var emailAddress = $.trim($('#forgotPasswordEmail').val());
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    $("#forgotPasswordAlert").stop(true, true);
    $("#forgotPasswordAlert .alert-message").html("Password reset email sent to " + emailAddress);
    $("#forgotPasswordButton").html('<i class="fa fa-check"></i>');
    $("#forgotPasswordAlert").addClass("alert-success").fadeIn();
  }, function(error) {
    var errorMessage = error.message;
    $("#forgotPasswordAlert").stop(true, true);
    $("#forgotPasswordButton").html('Reset Password');
    $("#forgotPasswordAlert .alert-message").html(errorMessage);
    $("#forgotPasswordAlert").fadeIn("fast").delay(6000).fadeOut("slow");
  });
});

// Let folks reset their password from within the app
$("#passwordResetForm").submit(function(event){
  event.preventDefault();
  var button = $(this).children("button");
  button.html('&nbsp;<i class="fa fa-spinner fa-spin"></i>&nbsp;');
  var user = firebase.auth().currentUser;
  var oldPassword = $("#oldPassword").val();
  var newPassword = $("#newPassword").val();
  $('#passwordResetForm').trigger("reset");
  var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
  user.reauthenticate(credential).then(function() {
    user.updatePassword(newPassword).then(function() {
      displayAlert("alert-success", "Password updated!");
      button.html('Reset Password');
      changeView("#mindfulness");
    }, function(error) {
      button.html('Reset Password');
      displayAlert("alert-error", error);
    });
  }, function(error) {
    button.html('Reset Password');
    displayAlert("alert-error", error);
  });
});
