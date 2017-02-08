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
    $(".tabs").show();
    $(newView + "Tab").parent("li").addClass('active');
  } else {
    $(".tabs").hide();
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
