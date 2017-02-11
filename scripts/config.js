// Config JS

var today  = new Date();
var todayString = (today.toDateString());

function formatSeconds(seconds){
  var d  = new Date(1970,0,1);
  d.setSeconds(seconds);
  return d.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

function formatMilliseconds(milliseconds){
  var d  = new Date(1970,0,1);
  d.setMilliseconds(milliseconds);
  if (milliseconds > 3600000) {
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  } else {
    return d.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
  }

}

function getMsSinceMidnight(d) {
  var e = new Date(d);
  return d - e.setHours(0,0,0,0);
}

function streakCalc(point){
  if (userProfile.streakDate > point - getMsSinceMidnight(point)) {
    // The user already did an audio today
    console.log("You already did one today");
     return newStreak = userProfile.streak;
  } else if (userProfile.streakDate > (point - getMsSinceMidnight(point) - 86400000)) {
    // The user did an audio yesterday
    console.log("Streak ++");
     return newStreak = userProfile.streak + 1;
  } else {
    // The user did not do an audio yesterday
    return newStreak = 1;
  }
}

$(".alert-dismiss").click(function(){
  $(this).parent().fadeOut();
});
