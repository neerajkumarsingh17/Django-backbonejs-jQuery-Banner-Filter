$(document).ready(function(){
    $.ajax({
        url: "get-language/",
        method :"get",
        success: function(data){
            if (data.language != ""){
                Localize.setLanguage(data.language);            
            }
        }
    });
});

Localize.on("setLanguage", function(){
    // write an ajax call here to set language in class UserProfile

    $.ajax({
        url: "set-language/?language="+Localize.getLanguage(),
        method :"get",
        success: function(result){
        }
    });
});