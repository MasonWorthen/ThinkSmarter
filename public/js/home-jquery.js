$(document).ready(function() {


  let width = $(window).width();
  console.log(width);
  if (width < 430){
    $('.resize-correct').hide();
    $('.resize-wrong').show();
  }
  else{
    $('.resize-wrong').hide();
    $('.resize-correct').show();
  }


  $(window).resize(function() {
    let width = $(window).width();
    if (width < 430){
      $('.resize-correct').hide();
      $('.resize-wrong').show();
      
  
    }
    else{
      $('.resize-wrong').hide();
      $('.resize-correct').show();
    }
   });


    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#active li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

    $(".cancel").hide();
    $(".sent").hide();
    $(".status").hide();




  
   


});
