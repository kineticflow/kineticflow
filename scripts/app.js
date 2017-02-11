// App JS

$(document).ready(function() {

  // Firebase is initialised in index.html

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
            "<li><p><em>" + dateString + "</em></p> " + value.preMood + " <i class='fa fa-plus icon-left icon-right'></i> " + value.activity + " <i class='fa fa-arrow-right icon-left icon-right'></i> " + value.postMood + "</li>"
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

  var data;

  const dataRef = firebase.database().ref('/data');
  dataRef.on('value', function(snapshot) {

    data = snapshot.val();

    $("#work-task-list").empty();
    $("#personal-task-list").empty();
    $(".mood-list").empty();

    $.each(data.tasks, function (key, value){
      if ( $.inArray("work", value.tags) > -1 ) {
        $("#work-task-list").append("<li><button class='btn btn-outline task-btn' id='" + value.id + "' name='" + value.title + "' data-origin='work'>" + value.title + "</button></li>");
      } else if ( $.inArray("personal", value.tags) > -1 ) {
        $("#personal-task-list").append("<li><button class='btn btn-outline task-btn' id='" + value.id + "' name='" + value.title + "' data-origin='personal'>" + value.title + "</button></li>");
      }
    });

    $.each(data.moods, function (key, value){
      $(".mood-list").append("<li><button class='btn btn-outline mood-btn' id='" + value.id + "' name='" + value.name + "'>" + value.name + "</button></li>");
    });

    var taskId, taskName, origin, moodId, moodName;

    var audio = $("#kfAudio");

    $(".task-btn").click(function(){
      taskId = $(this).attr('id');
      taskName = $(this).attr('name');
      origin = $(this).attr('data-origin');
      changeView("#moods");
      $("#moodsBack").attr('data-destination', origin);
      $(".upcoming-task").html(taskName);
    });

    $("#moodList .mood-btn").click(function(){
      moodId = $(this).attr('id');
      moodName = $(this).attr('name');
      changeView("#audio")
      $(".current-mood").html(moodName);
      $.each(data.audios, function(key, value){
        if ($.inArray(taskId, value.tags) > -1 && $.inArray(moodId, value.tags) > -1) {
          $(".audio-name").html(value.title);
          $("#audioTotalTime").html("<i class='fa fa-sun-o fa-spin'></i>");
          audio.attr('src', value.link);
          return false;
        } else {
          $(".audio-name").html("Oops, we haven't uploaded an appropriate audio yet!");
        }
      });
    });

    $("#cancelAudio").click(function(){
      changeView("#work");
      audio.get(0).pause();
    });

    audio.on("canplay", function(event){
      event.stopImmediatePropagation();
      $("#audioPlayedTime").html("00:00");
      $(".audio-progress").css('width', '0%');
      $(".play-pause i").removeClass("fa-pause").addClass("fa-play");
      $("#audioTotalTime").html(formatSeconds(this.duration));
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

    $("#postAudioMoodList .mood-btn").click(function(){

      var postMood = $(this).attr('name');

      var updates = {};

      var a = audio.get(0);

      var newStreakDate = Date.now();
      var newStreak = streakCalc(newStreakDate);
      var newTotalTime = userProfile.totalAudioTime + a.duration * 1000;
      var newTotalSessions = userProfile.totalSessions + 1;
      var newHistoryKey = new Date;
      var newHistoryObj = {
        "date" : newStreakDate,
        "preMood" : moodName,
        "activity" : taskName,
        "activityID" : taskId,
        "postMood" : postMood
      }
      var incrementStartingMood;
      $.each(userProfile.stats.startingMood, function(key, value){
        if (key === moodName){
          return incrementStartingMood = value + 1;
        }
      });
      var incrementActivity;
      $.each(userProfile.stats.activity, function(key, value){
        if (key === taskName){
          return incrementActivity = value + 1;
        }
      });
      var incrementEndingMood;
      $.each(userProfile.stats.endingMood, function(key, value){
        if (key === postMood){
          return incrementEndingMood = value + 1;
        }
      });

      updates['/users/' + currentUser + '/streak'] = newStreak;
      updates['/users/' + currentUser + '/streakDate'] = newStreakDate;
      updates['/users/' + currentUser + '/totalAudioTime'] = newTotalTime;
      updates['/users/' + currentUser + '/totalSessions'] = newTotalSessions;
      updates['/users/' + currentUser + '/history/' + newHistoryKey] = newHistoryObj;
      updates['/users/' + currentUser + '/stats/startingMood/' + moodName] = incrementStartingMood;
      updates['/users/' + currentUser + '/stats/activity/' + taskName] = incrementActivity;
      updates['/users/' + currentUser + '/stats/endingMood/' + postMood] = incrementEndingMood;

      try {
        firebase.database().ref().update(updates);
        changeView("#analytics");
        // $("#mainAlert").html("Profile changes saved!").fadeIn("fast").delay(3000).fadeOut("slow");
      } catch(error){
        console.log(error);
      }

    });

  }); // End of value

  // Functions and things
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


}); // End document.ready
