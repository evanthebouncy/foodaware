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
        $("#chooser").append(restrictionResult);
    });

    $("div.picker button").click(function(eventObj) {
        var id = $(this).closest(".picker").attr("id").split("-");
        var preferenceType = id[0];
        var itemName = id[1];
    });

    $("#clear-preferences").click(function() {
        clearPreferenceType("prefer");
    })

    $("#clear-restrictions").click(function() {
        clearPreferenceType("restrict");
    });

    // Set up handlers.
    $(".picker button.prefer").click(function() {
        updateButtonView($(this), "prefer");
    });
    $(".picker button.neutral").click(function() {
        updateButtonView($(this), undefined);
    });

    $(".picker button.restrict").click(function() {
        updateButtonView($(this), "restrict");
    });

    // Dynamically calculate the padding so that we leave enough space
    // no matter how narrow the window is.
    $(".navbar").next().css("padding-top", $(".navbar").height() + "px");
});

var updateButtonView = function($button, preferenceType) {
    var foodName = $button.closest("div.picker").attr("data-food-name");
    $button.siblings("button").removeClass("active");
    if (preferenceType)
        $button.addClass("active");
    setPreference(foodName, preferenceType);
}


// Set the preference of the given item to either "prefer",
// "restrict", or apathy (i.e., anything false-y).
var setPreference = function(foodName, preferenceType) {
    if (preferenceType && preferenceType != "prefer" && preferenceType != "restrict") {
        console.warn("preference type " + preferenceType + " bad. bug!");
        return;
    }

    var quoted = foodName.replace("\"", "\\\"");
    $("#prefer-list button[data-food-name=\"" + quoted + "\"]").remove();
    $("#restrict-list button[data-food-name=\"" + quoted + "\"]").remove();

    if (!preferenceType)
        return;

    var $targetList = $("#" + preferenceType + "-list");
    var $button = $("<button class='btn btn-medium'><i class='icon-remove'></i></button>")
        .append(" " + foodName).attr("data-food-name", foodName)
        .click(function() {
            setPreference(foodName, undefined);
        });
    $targetList.append($button);
}

var clearPreferenceType = function(preferenceType) {
    $("#" + preferenceType + "-list").empty();
}
