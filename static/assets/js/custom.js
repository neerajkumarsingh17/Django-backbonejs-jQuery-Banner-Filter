$(document).ready(function(){

    $('.go-to').click(function(){

        document.location = $(this).attr("data-url");

    });

});