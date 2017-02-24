// =======================================================================
//
//        A D M I N   T H I N G S
//
// =======================================================================
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Get the admin data

var adminApp = firebase.initializeApp(config, "Secondary");

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

// All Activities
var adminDataRef = firebase.database().ref("data");
adminDataRef.on('value', function(snapshot) {
  $('.activities-wrapper').empty();
  var appData = snapshot.val();
  $.each(appData.activities, function(key, value){

    var displayTags = value.tags + ""; // Cheat to convert array to string.
    displayTags = displayTags.replace(/,/g, ', ');

    var holderTitle = '<div class="activity-holder-title"><h4>' + value.title + ' <button class="btn btn-sm btn-success edit-activity-btn" id="'+ value.id +'Edit">Edit</button><button class="btn btn-sm btn-error cancel-activity-edit-btn">Cancel</button></h4></div>';

    var holderContent = '<div class="activity-holder-content"><p><strong>ID:</strong> ' + value.id + '</p><p><strong>Tags:</strong> ' + displayTags + '</p><p>' + value.description + '</p></div>';

    var displayHolder = '<div class="admin-activity" id="'+ value.id +'Holder">' + holderTitle + holderContent + '</div>';

    $('.activities-wrapper').append(displayHolder);

    // Edit activities
    $("#"+value.id+"Edit").on("click", function(){
      $(".edit-activity-btn").hide();
      $(this).next().show();
      $("#activityKey").val(key);
      $("#editActivityTitle").val(value.title);
      $("#editActivityID").val(value.id);
      $("#editActivityTags").val(value.tags);
      $("#editActivityDescription").val(value.description);
      $("#editActivityForm").detach().appendTo("#"+value.id+"Holder").fadeIn();
    });
    $(".cancel-activity-edit-btn").on("click", function(event){
      event.stopImmediatePropagation();
      $(this).hide();
      $("#editActivityForm").hide().detach().appendTo("#adminActivitiesView");
      $('#editActivityForm').trigger("reset");
      $("#activityKey").val('');
      $(".edit-activity-btn").show();
    });
  });
});

// Submit Edits
$("#editActivityForm").submit(function(event) {
  event.preventDefault();
  $("#editActivityForm").hide().detach().appendTo("#adminActivitiesView");
  var activityKey = $('#activityKey').val();
  var updateActivity = {
    "title": $('#editActivityTitle').val(),
    "id": $('#editActivityID').val(),
    "tags": $('#editActivityTags').val().replace(/,\s+/g, '').split(','),
    "description": $('#editActivityDescription').val()
  };
  try {
    firebase.database().ref('/data/activities/' + activityKey).set(updateActivity);
  } catch (error) {
    console.log(error);
  }
  finally {
    $('#editActivityForm').trigger("reset");
  }
  return false;
});
// Add new activities
$("#addNewActivityForm").on("submit", function(event) {
  var newActivity = {
    "title": $('#newActivityTitle').val(),
    "id": $('#newActivityID').val(),
    "tags": $('#newActivityTags').val().replace(/,\s+/g, ',').split(','),
    "description": $('#newActivityDescription').val()
  };
  try {
    firebase.database().ref('/data/activities').push(newActivity);
  } catch (error) {
    console.log(error);
  } finally {
    $('#addNewActivityForm').trigger("reset");
  }
  return false;
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

$("#addNewUserForm").on("submit", function(event){
  var email = $.trim($('#newUserEmail').val());
  console.log(email);
  var password = randomPassword();
  var name = $.trim($('#newUserName').val());
  var organisation = $.trim($('#newUserOrg').val());
  var newUserUID;
  adminApp.auth().createUserWithEmailAndPassword(email, password).then(function(snapshot) {
    newUserUID = snapshot.uid;
    adminApp.auth().signOut();
    var profileData = {
      "name" : name,
      "organisation" : organisation,
      "stats" : {
        "activity" : {
          "Start your work day calm and focused" : 0
        },
        "endingMood" : {
          "Calm" : 0
        },
        "startingMood" : {
          "Calm" : 0
        }
      },
      "streak" : 0,
      "streakDate" : 1483228800000,
      "superDuper" : "no",
      "totalAudioTime" : 0,
      "totalSessions" : 0
    };
    try {
      firebase.database().ref('/users/' + uid).set(profileData);
    } catch (error) {
      console.log(error);
    } finally {
      $("#addNewUserForm").trigger("reset");
      return false;
    }
  }, function(error){
    console.log(error);
  });
});

function randomPassword() {
    var chars = "abcdefghjkmnpqrstuvwxyz23456789";
    var password = "";
    for (var i = 0; i < 8; i++) {
        var x = Math.floor(Math.random() * chars.length);
        password += chars.charAt(x);
    }
    return password;
}
