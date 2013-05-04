Parse.initialize("NJaqeDB583JMB1TdWF2Tkpwkn9UbFsOOMhxhhPds", "69wSIovgcpBxqhsdhjlgohBJ2cTWGD3O1Y8JHQET");

$(document).ready(function() {
    if (!Parse.User.current()) {
        window.location.href = "login.html?continue=" + encodeURIComponent(window.location.href);
    }
});
