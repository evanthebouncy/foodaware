function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function createIdentifier(str) {
    return str.toLowerCase().replace(/ /g, "_");
}

var food = { "dairy": ["eggs", "milk", "butter", "ice cream"],
         "meat": ["pork", "steak", "veal"],
         "vegetables": ["carrots", "pickles", "onions"] };

var foodGroups = ["meat", "vegetables", "dairy"];

var preferences = {};


$(document).ready(function() {
    var source = $("#picker-template").html();
    var pickerTemplate = Handlebars.compile($("#picker-template").html());
    var dairy = pickerTemplate({groupName: "dairy", itemName: food["dairy"]});
    $.each(foodGroups, function(index, group) {
        var items = $.map(food[group], function(itemName) {
            return {identifier: createIdentifier(itemName),
                    displayName: ucFirst(itemName)
                   };
        });

        var restrictionResult = pickerTemplate({groupName: ucFirst(group),
                                                items: items,
                                               prefType: "restriction"});
        var preferenceResult = pickerTemplate({groupName: ucFirst(group),
                                               items: items,
                                               prefType: "preference"});
        $("#restriction-chooser").append(restrictionResult);
        $("#preference-chooser").append(preferenceResult);
    });

    $("div.picker button").click(function(eventObj) {
        var id = $(this).closest(".picker").attr("id").split("-");
        var preferenceType = id[0];
        var itemName = id[1];
        togglePreference(itemName, preferenceType);
    });

    $("#clear-restrictions").click(function() {
        clearPreferenceType("restriction");
    });
    $("#clear-preferences").click(function() {
        clearPreferenceType("preference");
    })
});

// "Toggle" the preference for the given item. If the preference is
// already the given preference type, the preference will be cleared;
// else, it will be set to that type.
var togglePreference = function(itemName, preferenceType) {
    getPicker(itemName, preferenceType).toggleClass("checked");
    // Un-prefer the item if we just restricted it, and
    // vice-versa.
    var otherType = preferenceType == "preference" ? "restriction" : "preference";
    getPicker(itemName, otherType).removeClass("checked");

    // Now actually set the preferences.
    if (preferences[itemName] == preferenceType)
        delete preferences[itemName];
    else
        preferences[itemName] = preferenceType;
}

var clearPreferenceType = function(preferenceType) {
    getChooser(preferenceType).find(".picker").removeClass("checked");
    $.each(preferences, function(key, value) {
        if (value == preferenceType)
            preferences[key] = undefined;
    });
}

var clearAllPreferences = function() {
    clearPreferences("preference");
    clearPreferences("restriction");
}


// Get the picker for a given item name and preference type.
var getPicker = function(itemName, preferenceType) {
    return $("#" + preferenceType + "-" + itemName);
}

var getChooser = function(preferenceType) {
    return $("#" + preferenceType + "-chooser");
}
