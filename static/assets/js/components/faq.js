
(function() {
  var nTimer = setInterval(function() {
    if (window.jQuery) {
      
        $(document).ready(function() {
          $('.js__grid-faq').cubeportfolio({
              filters: '.js__filters-faq',
              defaultFilter: '*',
              animationType: 'sequentially',
              gridAdjustment: 'default',
              displayType: 'default',
              caption: 'expand',
              gapHorizontal: 0,
              gapVertical: 0
          });
        });

      clearInterval(nTimer);
    }
  }, 100);
})();
