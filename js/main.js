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
        console.log("browser doesnt support Web speech API");
    } else {
        window.recognizer = new window.SpeechRecognition();
    }

    window.firebaseUrl = 'https://chit.firebaseIO.com/';
    window.firebaseRef = new Firebase(window.firebaseUrl);
    window.firebaseRef_users = window.firebaseRef.child("users");
    // Register the callback to be fired every time auth state changes
    window.firebaseRef.onAuth(authDataCallback);
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

// Create a callback which logs the current auth state
function authDataCallback(authData) {
    if (authData) {
        console.log("User is logged in with ", authData);
        var name = "";
        if (authData.facebook) {
            name = authData.facebook.displayName;
        } else if (authData.google) {
            name = authData.google.displayName;
        }
        var url = window.firebaseUrl+"users/"+authData.uid+".json";
        $.get(url, function(user){
            console.log("----check", user);
            if (user) {
                showToast("Welcome back " + name);
            } else {
                showToast("Hello " + name);
                window.firebaseRef.child("users").child(authData.uid).set(authData);
            }
        });
    } else {
        console.log("User is logged out");
    }
}

function login(username, password) {
    window.firebaseRef.authWithPassword({
        email: username,
        password: password
    }, authHandler);
}
function login_oath(provider) {
    window.firebaseRef.authWithOAuthRedirect(provider, authHandler);
}
// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
        switch (error.code) {
            case "INVALID_EMAIL":
                console.log("The specified user account email is invalid.");
                break;
            case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
            case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
            default:
                console.log("Error logging user in:", error);
        }
    } else {
        console.log("Authenticated successfully with payload:", authData);
    }
}

function logout() {
    window.firebaseRef.unauth();
}