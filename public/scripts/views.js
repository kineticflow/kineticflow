// Views JS

$(".menu-btn").click(function(){
  $(".mobile-menu").fadeIn();
});

$(".close-menu-btn").click(function(){
  $(".mobile-menu").fadeOut();
});

function changeView(newView){
  $("section").hide();
  $(".tabs li").removeClass('active');
  if (newView === "#mindfulness" || newView === "#analytics") {
    $(newView).fadeIn();
    $(".tabs").css("visibility", "visible");
    $(newView + "Tab").parent("li").addClass('active');
  } else {
    $(".tabs").css("visibility", "hidden");
    $(newView).fadeIn();
  }
}

$("#mindfulnessTab").click(function(){
  changeView("#mindfulness");
});

$("#analyticsTab").click(function(){
  changeView("#analytics");
});

$("#moodsBack").click(function(){
  changeView("#mindfulness");
});
