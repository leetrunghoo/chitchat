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

// Test browser support
    window.SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition ||
            null;
    if (window.SpeechRecognition === null) {
        console.log("browser dont support Web speech API");
    } else {
        window.recognizer = new window.SpeechRecognition();
    }

})(window, document);

function speak(textToSpeak) {
    // Create a new instance of SpeechSynthesisUtterance
    var speech = new SpeechSynthesisUtterance();
    // Set the text
    speech.text = textToSpeak;
    // Set accent
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
}

function listen(callback) {
    if (window.SpeechRecognition) {
        window.recognizer.onresult = function (event) {
            if (event.results.length > 0) {
                console.log(event.results);
                var text = event.results[0][0].transcript;
                if (callback) {
                    console.log("---------------text recognizer: " + text);
                    callback(text);
                }
            }
        };
        window.recognizer.start();
    } else {
        showToast("This browser doesn't support Web Speech API");
    }
}

function showPopupMessage(content) {
    var popup = document.getElementById("#popupMessage");
    var popContent = document.getElementById("#popupContent");
    popContent.innerHTML = content;
    popup.toggle();
}

function showToast(content) {
    document.getElementById('toast1').setAttribute("text", content);
    document.getElementById('toast1').show();
}