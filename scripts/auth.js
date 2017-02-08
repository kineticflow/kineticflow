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

// Get the user's profile and show them the logged in screens
var currentUser;
var userProfile;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $(".user-logged-out").hide();
    $(".user-logged-in").fadeIn();
    currentUser = user.uid;
    var userRef = firebase.database().ref("users/" + currentUser);
    userRef.on('value', function(snapshot) {
      userProfile = snapshot.val();
      $("#historyList").empty();
      $(".user-email").html(userProfile.name);
      $("#totalAudioTime").html(formatMilliseconds(userProfile.totalAudioTime));
      $("#totalSessions").html(userProfile.totalSessions);
      $("#streak").html(userProfile.streak);
      $("#frequentActivity").html(checkFrequency(userProfile.stats.activity));
      $("#startingMood").html(checkFrequency(userProfile.stats.startingMood));
      $("#endingMood").html(checkFrequency(userProfile.stats.endingMood));
      $.each(userProfile.history, function (key, value){
        var date = value.date;
        var dateString = new Date(date).toDateString();
        $("#historyList").append(
          "<li>" + dateString + " " + value.preMood + " <i class='fa fa-plus icon-left icon-right'></i> " + value.activity + " <i class='fa fa-arrow-right icon-left icon-right'></i> " + value.postMood + "</li>"
        );
      });
    });
  } else {
    $(".user-logged-in").hide();
    $(".user-logged-out").fadeIn();
    currentUser = "Nobody!";
    $(".user-email").html('');
  }
});

// Functions and things
function checkFrequency(stat){
  n = undefined;
  Object.keys(stat).forEach(function(q) {
    if (!n)
      n = stat[q];
    else if (n < stat[q]){
      n = stat[q];
    }
  });
  j = Object.keys(stat).filter(function(q) {
    return stat[q] == n
  })
  if (j.length > 1) {
    var a = "";
    for (var i = 0; i < j.length; i++) {
      a += j[i];
      if (i === j.length - 1) {
        break;
      } else {
        a += ", ";
      }
    }
  } else {
    var a = j;
  }
  return a;
}
