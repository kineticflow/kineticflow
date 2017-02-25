// Views JS

$(".menu-btn").on("click", function(){
  $('.menu-icon').toggleClass('rotate180');
  $(".menu").toggle('fast');
});

$(".mobile-menu-btn").on("click", function(){
  $(".mobile-menu").fadeIn();
});

$(".close-mobile-menu-btn").on("click", function(){
  $(".mobile-menu").fadeOut();
});

$('.reset-password-button').on("click", function(){
  $(".menu").hide('fast');
  $('.menu-icon').toggleClass('rotate180');
  $(".mobile-menu").fadeOut();
  changeView('#resetPassword');
});

function displayAlert(type, message) {
  $("#alertBox").append('<div class="alert '+ type +'"><div class="message">'+ message +'</div><button class="alert-dismiss-btn"><i class="fa fa-times"></i></button></div>');
  $('.alert-dismiss-btn').on('click', function(){
    $(this).parent().remove();
  });
}

function changeView(newView){
  $("section").hide();
  $(".tabs li").removeClass('active');
  if (newView === "#mindfulness" || newView === "#analytics" || newView === "#info" || newView === "#admin") {
    $(newView).fadeIn();
    $(".tabs").css("visibility", "visible");
    $(newView + "Tab").parent("li").addClass('active');
  } else {
    $(".tabs").css("visibility", "hidden");
    $(newView).fadeIn();
  }
}

function changeAdminView(newAdminView){
  $(".admin-view").hide();
  $("#" + newAdminView + "View").fadeIn();
  $(".admin-nav .btn").removeClass('active');
  $("#" + newAdminView + "Btn").addClass('active');
}

$("#mindfulnessTab").on("click", function(){
  changeView("#mindfulness");
});

$("#analyticsTab").on("click", function(){
  changeView("#analytics");
});

$("#infoTab").on("click", function(){
  changeView("#info");
});

$("#adminTab").on("click", function(){
  changeView("#admin");
});

$(".back-btn").on("click", function(){
  changeView("#mindfulness");
});

$("#adminAnalyticsBtn").on("click", function(){
  changeAdminView("adminAnalytics");
});

$("#adminActivitiesBtn").on("click", function(){
  changeAdminView("adminActivities");
});

$("#adminAudiosBtn").on("click", function(){
  changeAdminView("adminAudios");
});

$("#adminGroupsBtn").on("click", function(){
  changeAdminView("adminGroups");
});

$("#adminUsersBtn").on("click", function(){
  changeAdminView("adminUsers");
});
