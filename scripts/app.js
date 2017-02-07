// App JS

$(document).ready(function() {

  // Firebase is initialised in index.html

  // But what day is it?!
  var today  = new Date();
  var todayString = (today.toDateString());
  function formatSeconds(seconds){
    var date  = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
  }

  // Step 1 load tasks , moods and analytics

  const dbRef = firebase.database().ref();
  dbRef.on('value', function(snapshot) {

    var data = snapshot.val();

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

    console.log(currentUser);

    $.each(data.users, function (key, value){
      if (key === currentUser) {
        console.log(value.name);
        $("#totalAudioTime").html(value.totalAudioTime);
        $("#streak").html(value.streak);
        return false;
      }
    });

    // Step 2 follow the clicks!

    var taskId;
    var taskName;
    var origin;
    var moodId;
    var moodName;

    $(".task-btn").click(function(){
      taskId = $(this).attr('id');
      taskName = $(this).attr('name');
      origin = $(this).attr('data-origin');
      changeView("#moods");
      $("#moodsBack").attr('data-destination', origin);
      $(".upcoming-task").html(taskName);
      $("#moodList .mood-btn").click(function(){
        moodId = $(this).attr('id');
        moodName = $(this).attr('name');
        var audio;
        changeView("#audio")
        $(".current-mood").html(moodName);
        $.each(data.audios, function(key, value){
          if ($.inArray(taskId, value.tags) > -1 && $.inArray(moodId, value.tags) > -1) {
            $(".audio-name").html(value.title);
            audio = $("#kfAudio");
            audio.attr('src', '/audio/' + value.fileName);
            return false;
          } else {
            $(".audio-name").html("Oops, we haven't uploaded an appropriate audio yet!");
          }
        });

        audio.on("canplay", function(event){
          event.stopImmediatePropagation();
          $("#audioTotalTime").html(formatSeconds(this.duration));
        });

        $(".play-pause").click(function(){
          if (audio.get(0).paused == false) {
            audio.get(0).pause();
            $(".play-pause i").removeClass("fa-pause").addClass("fa-play");
            $('.audio-progress').stop();
          } else {
            audio.get(0).play();
            $(".play-pause i").removeClass("fa-play").addClass("fa-pause");
          }
        });

        $( ".seekbar" ).mouseover(function(){
          $(this).css("cursor","pointer");
        });

        $(".seekbar").click(function(e) {
          var x = e.pageX - $(this).offset().left;
          var width = $(this).width();
          var duration = audio.get(0).duration;
          audio.get(0).currentTime = x / width * duration;
        });

        audio.on('timeupdate', function(){
          $("#audioPlayedTime").html(formatSeconds(this.currentTime));
          $('.audio-progress').width(audio.get(0).currentTime/audio.get(0).duration * 100 + '%');
        });

        audio.on('ended', function(){
          $(".play-pause i").removeClass("fa-pause").addClass("fa-play");
          changeView("#postAudioMood");

          $("#postAudioMoodList .mood-btn").click(function(){

            // // First profile info
            // var profileName = $('#profileName').val();
            // var profileBio = $('#profileBio').val();
            //
            // // var uid = firebase.auth().currentUser.uid;
            // var updates = {};
            //
            // updates['/userProfile/' + uid + '/name'] = profileName;
            // updates['/userProfile/' + uid + '/bio'] = profileBio;
            // updates['/userProfile/' + uid + '/ig'] = profileIg;
            // updates['/userProfile/' + uid + '/age'] = profileAge;
            // updates['/userProfile/' + uid + '/gender'] = profileGender;
            // updates['/userProfile/' + uid + '/from'] = profileFrom;
            // updates['/userProfile/' + uid + '/occupation'] = profileOccupation;
            // updates['/userProfile/' + uid + '/favourite'] = profileFavourite;
            // updates['/userProfile/' + uid + '/style'] = profileStyle;
            // updates['/userProfile/' + uid + '/dealbreaker'] = profileDealbreaker;
            // updates['/userProfile/' + uid + '/continent'] = profileContinent;
            //
            // try {
            //   firebase.database().ref().update(updates);
            //   $("#profile-alert-error").hide()
            //   $(".view").fadeOut("fast");
            //   $(".modal-alert").hide();
            //   $(".modal-container").fadeOut("fast");
            //   $("#mainAlert").html("Profile changes saved!").fadeIn("fast").delay(3000).fadeOut("slow");
            // } catch(error){
            //   $("#profile-alert-error").show().html("<strong>Hold up!</strong> Make sure that you've answered each question, then try saving again.");
            // }

            changeView("#analytics");

          });

        });

      });

    });

  });

});
