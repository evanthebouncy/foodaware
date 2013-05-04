Parse.initialize("NJaqeDB583JMB1TdWF2Tkpwkn9UbFsOOMhxhhPds", "69wSIovgcpBxqhsdhjlgohBJ2cTWGD3O1Y8JHQET");



function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function createIdentifier(str) {
    return str.toLowerCase().replace(/ /g, "_");
}

$(document).ready(function() {
    Parse.User.logIn("janedoe", "janedoe", function(user) {
        var query = new Parse.Query(Settings);
        query.equalTo("user", user).first({
            success: function(settings) {
                setupEntrySystem(settings || new Settings);
            },

            error: function(settings, error) {
                console.log("no settings found, using default");
                setupEntrySystem(settings || new Settings);
            }});
    });
});

// This actually sets up all the data entry options; we call it once
// we have the existing settings.
var setupEntrySystem = function(settings) {
    $.each(ingredientGroups, function(index, group) {
        var itemButtons = $.map(ingredients[group], function(itemName) {
            return new ValenceButton({identifier: itemName,
                                      displayName: ucFirst(itemName),
                                      model: settings
                                     });
        });

        var group = new ChooserGroup({subviews: itemButtons,
                                   groupName: ucFirst(group),
                                   model: settings});
        $("#chooser").append(group.render().el);
    });

    preferenceValenceGroup = new ValenceGroup({type: "prefer",
                                               hasClear: true,
                                               model: settings});
    restrictionValenceGroup = new ValenceGroup({type: "restrict",
                                                hasClear: true,
                                                model: settings});

    $("#valence-groups").append(preferenceValenceGroup.render().el)
        .append(restrictionValenceGroup.render().el);

    // Dynamically calculate the padding so that we leave enough space
    // no matter how narrow the window is.
    $(".navbar").next().css("padding-top", $(".navbar").height() + "px");
}
