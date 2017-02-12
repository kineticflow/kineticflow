// App JS

$(document).ready(function() {

  // Firebase is initialised in index.html

  firebase.auth().onAuthStateChanged(function(user) {

    if (!user) {
      $(".user-logged-in").hide();
      $(".user-logged-out").fadeIn();
      currentUser = "Nobody!";
      $(".user-email").html('');
    } else {

      // Here's the main app

      $(".user-logged-out").hide();
      $(".user-logged-in").fadeIn();

      var currentUser = user.uid;
      var userProfile;
      var organisation;
      var data;

      // Find what organisation we're part of and build the list of activities.
      var userOrganisationRef = firebase.database().ref("users/" + currentUser + "/organisation");
      userOrganisationRef.once('value').then(function(snapshot){
        organisation =  snapshot.val();
        const dataRef = firebase.database().ref('/data');
        dataRef.on('value', function(snapshot) {
          data = snapshot.val();
          $(".activity-list").empty();
          $(".mood-list").empty();
          $.each(data.activities, function (key, value){
            if ( $.inArray(organisation, value.tags) > -1 ) {
              $(".activity-list").append("<li><button id="+ value.id +" class='btn btn-outline activity-btn'>"+ value.title +"</button></li>");
            }
          });
          $.each(data.moods, function (key, value){
            $(".mood-list").append("<li><button class='btn btn-outline mood-btn' id='" + value.id + "'>" + value.name + "</button></li>");
          });
        });
      });

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
            "<li><p><em>" + dateString + "</em></p> " + value.preMood + " <i class='fa fa-plus icon-left icon-right'></i> " + value.activity + " <i class='fa fa-arrow-right icon-left icon-right'></i> " + value.postMood + "</li>"
          );
        });
      });

      var activityId, activityName, origin, moodId, moodName;

      var audio = $("#kfAudio");

      $(".activity-list").on('click', '.activity-btn', function(){
        activityId = $(this).attr('id');
        activityName = $(this).html();
        changeView("#moods");
        $(".upcoming-activity").html(activityName);
      });

      $("#preMoodList").on('click', '.mood-btn', function(){
        changeView("#audio")
        moodId = $(this).attr('id');
        moodName = $(this).html();
        $.each(data.audios, function(key, value){
          if ($.inArray(activityId, value.tags) > -1 && $.inArray(moodId, value.tags) > -1) {
            $(".audio-name").html(value.title);
            $("#audioTotalTime").html("<i class='fa fa-sun-o fa-spin'></i>");
            audio.attr('src', value.link);
            return false;
          } else {
            $(".audio-name").html("Sorry, we've made an error! Try refreshing the page.");
            $(".play-pause i").removeClass("fa-pause fa-play fa-sun-o fa-spin").addClass("fa-times");
          }
        });
      });

      $("#cancelAudio").click(function(){
        changeView("#mindfulness");
        resetAudioPlayer();
      });

      audio.on("canplay", function(event){
        event.stopImmediatePropagation();
        $("#audioTotalTime").html(formatSeconds(this.duration));
        $(".play-pause i").removeClass("fa-sun-o fa-spin fa-pause").addClass("fa-play");
      });

      $(".play-pause").click(function(e){
        e.preventDefault;
        var a = audio.get(0);
        if (a.paused == false) {
          a.pause();
          $(".play-pause i").removeClass("fa-pause").addClass("fa-play");
        } else {
          a.play();
          $(".play-pause i").removeClass("fa-play").addClass("fa-pause");
        }
      });

      $( ".seekbar" ).mouseover(function(){
        $(this).css("cursor","pointer");
      });

      $(".seekbar").click(function(e) {
        var a = audio.get(0);
        var x = e.pageX - $(this).offset().left;
        var width = $(this).width();
        var duration = a.duration;
        a.currentTime = x / width * duration;
      });

      audio.on('timeupdate', function(){
        $("#audioPlayedTime").html(formatSeconds(this.currentTime));
        $('.audio-progress').width(this.currentTime/this.duration * 100 + '%');
      });

      audio.on('ended', function(){
        changeView("#postAudioMood");
      });

      $("#postAudioMoodList").on('click', '.mood-btn', function(){

        var postMood = $(this).html();
        var updates = {};

        var a = audio.get(0);

        var newStreakDate = Date.now();
        var newStreak = streakCalc(newStreakDate, userProfile.streakDate, userProfile.streak);
        var newTotalTime = userProfile.totalAudioTime + a.duration * 1000;
        var newTotalSessions = userProfile.totalSessions + 1;
        var newHistoryKey = new Date;
        var newHistoryObj = {
          "date" : newStreakDate,
          "preMood" : moodName,
          "activity" : activityName,
          "activityID" : activityId,
          "postMood" : postMood
        }

        updates['/users/' + currentUser + '/streak'] = newStreak;
        updates['/users/' + currentUser + '/streakDate'] = newStreakDate;
        updates['/users/' + currentUser + '/totalAudioTime'] = newTotalTime;
        updates['/users/' + currentUser + '/totalSessions'] = newTotalSessions;
        updates['/users/' + currentUser + '/history/' + newHistoryKey] = newHistoryObj;

        var stats = userProfile.stats;
        stats.startingMood[moodName] = (stats.startingMood[moodName] || 0) + 1;
        stats.activity[activityName] = (stats.activity[activityName] || 0) + 1;
        stats.endingMood[postMood] = (stats.endingMood[postMood] || 0) + 1;

        try {
          firebase.database().ref().update(updates);
          firebase.database().ref('/users/' + currentUser + '/stats/').set(stats);
          changeView("#analytics");
          resetAudioPlayer();
          // $("#mainAlert").html("Profile changes saved!").fadeIn("fast").delay(3000).fadeOut("slow");
        } catch(error){
          console.log(error);
        }

      });
    } // End of else from `if(user)`
  });
}); // End document.ready

function resetAudioPlayer(){
  $("#kfAudio").get(0).pause();
  $("#kfAudio").attr('src', '');
  $("#audioPlayedTime").html("00:00");
  $("#audioTotalTime").html("00:00");
  $(".audio-progress").css('width', '0%');
  $(".play-pause i").removeClass("fa-pause fa-play fa-times").addClass("fa-sun-o fa-spin");
}

function checkFrequency(stat){
  n = undefined;
  var l = Object.keys(stat).length;
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
  if (j.length == l) {
    var a = "N/A";
  } else if (j.length > 1) {
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
