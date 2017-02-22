// =======================================================================
//
//        A D M I N   T H I N G S
//
// =======================================================================
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Get the admin data

var adminDBRef = firebase.database().ref("admin");
adminDBRef.on('value', function(snapshot) {

  $("#adminAnalyticsLists").empty();
  $("#groupsList").empty();

  var adminData = snapshot.val();

  // Show the Admin all analytics

  $.each(adminData.organisations, function(key, value){
    var organisation = value.replace(/\s+/g, '');
    $("#adminAnalyticsLists").append('<div class="tableWrapper" id="'+ organisation +'Analytics"><h3>' + value + '</h3><table><tbody></tbody></table></div>');
    // Add to groups too
    $("#groupsList").append('<li>'+ value +' <button class="delete-group btn btn-error btn-sm" id="'+key+'"><i class="fa fa-trash-o"></i></button></li>');
  });

  $.each(adminData.history, function(key, value){
    var historyDate = new Date(value.date).toDateString();
    var organisation = value.organisation;
    $("#" + organisation.replace(/\s+/g, '') + "Analytics table tbody").append('<tr><td>' + historyDate + '</td><td>' + organisation + '</td><td>' + value.name + '</td><td>' + value.preMood + '</td><td>' + value.activity + '</td><td>' + value.postMood + '</td></tr>');
  });

  $('.delete-group').on('click', function() {
    var deleteRef = $(this).attr('id');
    try {
      firebase.database().ref('/admin/organisations/' + deleteRef).remove();
    } catch (error) {
      console.log(error);
    }
  });

});

var adminDataRef = firebase.database().ref("data");
adminDataRef.on('value', function(snapshot) {
  $('#activitiesTable').empty();
  var appData = snapshot.val();
  $.each(appData.activities, function(key, value){
    $('#activitiesTable').append('<tr><td>' + value.id + '</td><td>' + value.title + '</td><td>' + value.tags + '</td><td>' + value.description + '</td></tr>')
  });
});

// Let an admin upload a new audio
var storageRef = firebase.storage().ref();
var file;
$("#newFile").on("change", function(){
  file = this.files[0];
  return file;
});

$("#newAudioForm").on("submit", function(event) {
  var newAudioID = $('#newAudioID').val();
  var newAudioTitle = $('#newAudioTitle').val();
  var newAudioTags = $('#newAudioTags').val().replace(/\s+/g, '').split(',');
  var uploadTask = storageRef.child(file.name).put(file);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.progress: // or 'paused'
          console.log('Upload is ' + progress + '% done');
          break;
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
      }
    }, function(error) {
    switch (error.code) {
      case 'storage/unauthorized':
        console.log("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        console.log("User canceled the upload");
        break;
      case 'storage/unknown':
        console.log("Unknown error occurred, inspect error.serverResponse");
    }
  }, function() {
    var downloadURL = uploadTask.snapshot.downloadURL;
    console.log("Successful upload: " + downloadURL);
    var newAudioObj = {
      "id" : newAudioID,
      "link" : downloadURL,
      "tags" : newAudioTags,
      "title" : newAudioTitle
    }
    try {
      var newAudioKey = firebase.database().ref('/data/audios/').push().key;
      firebase.database().ref('/data/audios/' + newAudioKey).update(newAudioObj);
    } catch(error){
      console.log(error);
    } finally {
      $('#newAudioForm').trigger("reset");
    }
  });
  return false;
});

$("#addNewGroupForm").on("submit", function(event) {
  var newGroup = $('#newGroupId').val();
  try {
    firebase.database().ref('/admin/organisations').push(newGroup);
  } catch (error) {
    console.log(error);
  } finally {
    $('#addNewGroupForm').trigger("reset");
  }
  return false;
});
