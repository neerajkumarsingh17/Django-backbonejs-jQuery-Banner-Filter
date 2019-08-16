$(function() {
  $('a[rel*=leanModal]').leanModal({
    top: 10,
    closeButton: "#close_video"
  });
});

$(document).ready(function() {
  $("#video_button").click(function() {
    document.getElementById("playvideo").src += "?autoplay=1&enablejsapi=1"
    document.getElementById("playvideo").playVideo();
  });
});



function toggleVideo(state) {
    // if state == 'hide', hide. Else: show video
    var div = document.getElementById("video_div");
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : '';
    func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
}
