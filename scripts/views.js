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

  $("#analyticsTab").click(function(){
    $(".tabs li").removeClass('active');
    $(this).parent("li").addClass('active');
    $("section").hide();
    $("#analytics").fadeIn();
  });

  $("#moodsBack").click(function(){
    $("section").hide();
    if ($(this).attr('data-destination') === "work") {
      $("#work").fadeIn();
    } else {
      $("#personal").fadeIn();
    }
    $(".tabs").show();
  });

  $("#cancelAudio").click(function(){
    $("section").hide();
    $("#kfAudio").attr('src', '');
    $(".tabs li").removeClass('active');
    $("#workTab").parent("li").addClass('active');
    $("#work").fadeIn();
    $(".tabs").show();
  });

});
