// App JS

$(document).ready(function() {

  // Firebase is initialised in index.html

  // But what day is it?!
  var date  = new Date();
  var today = (date.toDateString());

  // Display work tasks
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
      $("#moods-list").append("<li><button class='btn btn-outline mood-btn' id='" + value.id + "' name='" + value.name + "'>" + value.name + "</button></li>");
    });

    var taskId;
    var taskName;
    var origin;
    var moodId;
    var moodName;

    $(".task-btn").click(function(){
      taskId = $(this).attr('id');
      taskName = $(this).attr('name');
      origin = $(this).attr('data-origin');
      $("section").hide();
      $(".tabs").hide();
      $("#moods").fadeIn();
      $("#moodsBack").attr('data-destination', origin);
      $(".upcoming-task").html(taskName);

      $(".mood-btn").click(function(){
        moodId = $(this).attr('id');
        moodName = $(this).attr('name');
        var audio;
        $("section").hide();
        $("#audio").fadeIn();
        $(".current-mood").html(moodName);
        $.each(data.audios, function(key, value){
          if ($.inArray(taskId, value.tags) > -1 && $.inArray(moodId, value.tags) > -1) {
            $(".audio-name").html(value.title);
            audio = $("#kfAudio");
            audio.attr('src', '/audio/' + value.fileName);
            audio.on("canplay", function(event){
              event.stopImmediatePropagation();
              // Build the audio player
            });
            return false;
          } else {
            $(".audio-name").html("Oops, we haven't uploaded an appropriate audio yet!");
          }
        });

        audio.on('timeupdate', function(){
          $('#seekbar').attr("value", this.currentTime / this.duration * 100);
        });

        audio.on('ended', function(){
          console.log("Audio Ended");
        });

        // // Progress bar, try something like:
        // $( "#progressbar" ).click(function(e) {
        //   var playingSound = soundManager.getSoundById(_.keys(soundManager.sounds)[0]),
        //   x               = e.pageX - $(this).offset().left,
        //   width           = $(this).width(),
        //   duration        = playingSound.durationEstimate;
        //   playingSound.setPosition((x / width) * duration);
        // });
        //
        // $( "#progressbar" ).mouseover(function(){
        //   $(this).css("cursor","pointer");
        // });

      });

    });

  });

});
