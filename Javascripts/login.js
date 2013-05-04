Parse.initialize("NJaqeDB583JMB1TdWF2Tkpwkn9UbFsOOMhxhhPds", "69wSIovgcpBxqhsdhjlgohBJ2cTWGD3O1Y8JHQET");

var $alert;

$(document).ready(function() {
    $("#login-form").submit(function(ev) {
        ev.preventDefault();
        var username = ev.target.elements.username.value;
        var password = ev.target.elements.password.value;

        Parse.User.logIn(username, password, {
            success: function(user) {
                continueOn();
            },

            error: function(user, error) {
                $("#fail-alert").css("display", "block");
                $("#alert-message").text("Logging in failed! Check your username and password.");
            }
        });
    });

    $("#register").click(function(ev) {
        ev.preventDefault();
        var $form = $(ev.target).closest("form");
        var username = $form.find("[name=username]").val();
        var password = $form.find("[name=password]").val();

        Parse.User.signUp(username, password, null, {
            success: function(user) {
                continueOn();
            },

            error: function(user, error) {
                console.log(error);
                $("#fail-alert").css("display", "block");
                if (error.code == -1)
                    message = "Your password must not be empty.";
                else if (error.code == 202)
                    message = "Username " + username + " is already taken.";
                else
                    message = error.message;
                $("#register-fail-alert").css("display", "block");
                $("#alert-message").text(message);
            }
        });

    });
});

var continueOn = function() {
    var continueResult = new RegExp(/[\?^]continue=([^&#]*)/).exec(window.location.href);
    if (continueResult) {
        window.location.href = decodeURIComponent(continueResult[1]);
    } else {
        window.location.href = "restriction_prefs.html";
    }
};
