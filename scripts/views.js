// Views JS

$(document).ready(function() {

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
