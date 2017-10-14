$(document).ready(function(){


  //h1 loads line by line on page load
  var str = "Sounds of East Boston";
  var spans = '<span>' + str.split(/\s+/).join(' </span><span>') + '</span>';
  $(spans).hide().appendTo('h1').each(function(i) {
    $(this).delay(125 * i).fadeIn();
  }); //end h1 loads line by line on page load

  //navigation menu revealed on click
  $("nav > div").on("click",function(){
    $("ul").toggleClass("hiddenNav");
    if(!$("nav > div").hasClass("hiddenNav")){
      $("li").hide().appendTo("ul").each(function(i){
        $(this).delay(125 * i).fadeIn();
      });
    }
  }); //end navigation menu revealed on click

//if the user clicks on the arrow, show facts
  $("footer").on("click",function(){
    $("div").each(function(i){
      $(this).delay(150 * i).fadeIn().css('opacity','1.0');
    });
    $("footer > p").addClass("hide");

  });


});
