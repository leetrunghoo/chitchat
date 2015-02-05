(function (window, document, undefined) {
    'use strict';
    window.addEventListener('WebComponentsReady', function (e) {
        console.log('web componenets ready');
        // Set duration for core-animated-pages transitions
        CoreStyle.g.transitions.duration = '0.5s';
    });

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
    document.getElementById('toast').setAttribute("text", content);
    document.getElementById('toast').show();
}
function showDialog(content) {
    document.getElementById('dialogContent').innerHTML = content;
    document.getElementById('dialog').toggle();
}
function showDialog_error(content) {
    document.getElementById('dialogContent').innerHTML = "<h4>Error:</h4>" + content;
    document.getElementById('dialog').toggle();
}

function getUserProfile(authData) {
    var user = {
        id: authData.uid,
        statusClass: "status-"+authData.status
    };
    if (authData.facebook) {
        user.name = authData.facebook.displayName;
        user.avatar = "http://graph.facebook.com/" + authData.facebook.id + "/picture?width=100&height=100";
    } else if (authData.twitter) {
        user.name = authData.twitter.displayName;
        user.avatar = authData.twitter.cachedUserProfile.profile_image_url_https.replace("normal", "bigger");
    } else if (authData.github) {
        user.name = authData.github.displayName;
        user.avatar = authData.github.cachedUserProfile.avatar_url;
    } else if (authData.google) {
        user.name = authData.google.displayName;
        user.avatar = authData.google.cachedUserProfile.picture;
    } else if (authData.password) {
        user.name = authData.password.name;
        user.avatar = authData.password.avatar;
    }
    switch (authData.status) {
        case 0: 
        default:
            user.status = " is offline";
            break;
        case 1: 
            user.status = " is online";
    }
    return user;
}

function login_action(email, password, callback) {
    window.firebaseRef.authWithPassword({
        email: email,
        password: password
    }, function (error, authData) {
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
            showDialog_error(error.message);
        } else {
            if (callback) {
                callback(authData);
            }
        }
    });
}

function playSound() {
    var audio = new Audio('sound/noti.mp3');
    audio.play();
}

/** UTIL **/

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i]))
            return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer function
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

Array.prototype.sortByStatus = function () {
    function compare(a, b) {
        if (a.status < b.status)
            return 1;
        if (a.status > b.status)
            return -1;
        return 0;
    }
    return this.sort(compare);
};


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
    return cYear + "/" + cMonth + "/" + cDate + " " + hh + ":" + mm + ":" + ss;
}