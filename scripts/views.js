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
  if (newView === "#personal" || newView === "#work" || newView === "#analytics") {
    $(newView).fadeIn();
    $(".tabs").css("visibility", "visible");
    $(newView + "Tab").parent("li").addClass('active');
  } else {
    $(".tabs").css("visibility", "hidden");
    $(newView).fadeIn();
  }
}

$("#personalTab").click(function(){
  changeView("#personal");
});

$("#workTab").click(function(){
  changeView("#work");
});

$("#analyticsTab").click(function(){
  changeView("#analytics");
});

$("#moodsBack").click(function(){
  if ($(this).attr('data-destination') === "work") {
    changeView("#work");
  } else {
    changeView("#personal");
  }
});
