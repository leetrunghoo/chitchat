(function (window, document, undefined) {
    'use strict';
    window.addEventListener('WebComponentsReady', function (e) {
        console.log('web componenets ready');
        // Set duration for core-animated-pages transitions
        CoreStyle.g.transitions.duration = '0.5s';
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
        console.log("browser doesnt support Web speech API");
    } else {
        window.recognizer = new window.SpeechRecognition();
    }

    window.firebaseUrl = 'https://chit.firebaseIO.com/';
    window.firebaseRef = new Firebase(window.firebaseUrl);
    
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

function getDateTime(time) {
    var today = new Date();
    if (time) {
        today = new Date(time);
    }
    var cDate = today.getDate();
    if (cDate < 10) {
        cDate = "0" + cDate;
    }
    var cMonth = today.getMonth() + 1;
    if (cMonth < 10) {
        cMonth = "0" + cMonth;
    }
    var cYear = today.getFullYear();
    
    var hh = today.getHours();
    if (hh < 10) {
        hh = "0" + hh;
    }
    var mm = today.getMinutes();
    if (mm < 10) {
        mm = "0" + mm;
    }
    var ss = today.getSeconds();
    if (ss < 10) {
        ss = "0" + ss;
    }   
    return cYear + "/" + cMonth + "/" + cDate + " " + hh + ":"+mm+":"+ss;
}

function getUserProfile(authData){
    var user = {
        name: "",
        avatar: ""
    };
    if (authData.facebook) {
        user.name = authData.facebook.displayName;
        user.avatar = "http://graph.facebook.com/"+authData.facebook.id+"/picture?width=100&height=100";
    }
    return user;
}