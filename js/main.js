(function (window, document, undefined) {
    'use strict';

        window.addEventListener('WebComponentsReady', function (e) {
            console.log('web componenets ready');
            // Set duration for core-animated-pages transitions
            CoreStyle.g.transitions.duration = '1s';
        });
//        // Fired before a page transition occurs
//        pages.addEventListener('core-animated-pages-transition-prepare', function () {
//            pages.selectedItem.querySelector('.page').transitionBegin();
//        });
//        //Fired when a page transition completes.
//        pages.addEventListener('core-animated-pages-transition-end', function () {
//            pages.selectedItem.querySelector('.page').transitionEnd();
//        });

})(window, document);
