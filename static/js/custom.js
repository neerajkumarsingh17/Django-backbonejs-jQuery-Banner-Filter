$(document).on('click', '.go-to', function() {
    url = $(this).attr("data-url");
    target = $(this).attr("data-target");

    if(target == undefined){
        target = "__new"
    }

    window.open(url, target);
});

$(document).on('click', '.go-to-self', function() {
    url = $(this).attr("data-url");
    document.location = url;
});

$(document).on('click', '.action-more', function() {
    var el = $(this).parent(".wrapper-action-more").find(".actions-dropdown");
    if(el.hasClass('is-visible')){
        el.addClass('is-visible');
    }else{
        el.removeClass('is-visible');
    }
    
});
