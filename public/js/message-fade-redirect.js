$(document).ready(function() {
    setTimeout(function(){
    $('.alert').removeClass('text-danger');
    $('.alert').removeClass('text-success');
    $('.alert').addClass('text-dark');

    if ($('.page').text() == 'Survey has sucessfully been submitted. Thank you! Redirecting you to the research page in 5 seconds...'){
        $(location).attr("href", "http://localhost:3005/research");
    }
    },5000)
   
});