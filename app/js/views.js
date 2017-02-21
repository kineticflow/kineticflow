// Views JS

$(".menu-btn").on("click", function(){
  $(".mobile-menu").fadeIn();
});

$(".close-menu-btn").on("click", function(){
  $(".mobile-menu").fadeOut();
});

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

$("#moodsBack").on("click", function(){
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
