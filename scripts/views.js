// Views JS

$(document).ready(function() {

  $(".menu-btn").click(function(){
    $(".mobile-menu").fadeIn();
  });

  $(".close-menu-btn").click(function(){
    $(".mobile-menu").fadeOut();
  });

  $("#personalTab").click(function(){
    $(".tabs li").removeClass('active');
    $(this).parent("li").addClass('active');
    $("section").hide();
    $("#personal").fadeIn();
  });

  $("#workTab").click(function(){
    $(".tabs li").removeClass('active');
    $(this).parent("li").addClass('active');
    $("section").hide();
    $("#work").fadeIn();
  });

  $("#favouritesTab").click(function(){
    $(".tabs li").removeClass('active');
    $(this).parent("li").addClass('active');
    $("section").hide();
    $("#favourites").fadeIn();
  });



});
