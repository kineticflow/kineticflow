function stickyFooter() {
  var bodyBottomMargin = $("footer").outerHeight();
  $("body").css("margin-bottom", bodyBottomMargin);
}

// Set bottom margin of body
stickyFooter();

// If the footer height changes when the window is resized, make sure we handle it
$( window ).resize(function() {
  stickyFooter();
});
