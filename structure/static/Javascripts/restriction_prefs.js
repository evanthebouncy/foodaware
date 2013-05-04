// Load in preferences from local storage
localStorage["preferences"] = localStorage["preferences"] || "{}";
var preferences = JSON.parse(localStorage["preferences"]);

function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function createIdentifier(str) {
    return str.toLowerCase().replace(/ /g, "_");
}

$(document).ready(function() {
    var source = $("#picker-template").html();
    var pickerTemplate = Handlebars.compile($("#picker-template").html());
    var dairy = pickerTemplate({groupName: "dairy", itemName: ingredients["dairy"]});
    $.each(ingredientGroups, function(index, group) {
        var items = $.map(ingredients[group], function(itemName) {
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

    $(".picker-band button.restrict").click(function() {
        updateGroup($(this), "restrict");
        return false;
    });

    // Dynamically calculate the padding so that we leave enough space
    // no matter how narrow the window is.
    $(".navbar").next().css("padding-top", $(".navbar").height() + "px");

    // Load the preferences. This is a pretty awful way of doing it, but it works.
    $.each(preferences, function(foodName, valence) {
        $(".picker[data-food-name=\"" + foodName + "\"] ." + valence).click();
    });
});

var updateButtonView = function($button, preferenceType) {
    var foodName = $button.closest("div.picker").attr("data-food-name");
    if ($button.hasClass("active")) {
        $button.removeClass("active");
        setPreference(foodName, undefined);
    } else {
        $button.siblings("button").removeClass("active");
        if (preferenceType)
            $button.addClass("active");
        setPreference(foodName, preferenceType);
    }
}

// THIS IS AWFUL, so awful. Don't let this get to production, please.
var updateGroup = function($group) {
    $inactive = $group.closest(".accordion-group").find(".picker .restrict:not(.active)")
    $inactive.trigger("click");
}

// Set the preference of the given item to either "prefer",
// "restrict", or apathy (i.e., anything false-y).
var setPreference = function(foodName, preferenceType) {
    preferences[foodName] = preferenceType;
    localStorage["preferences"] = JSON.stringify(preferences);
    if (preferenceType && preferenceType != "prefer" && preferenceType != "restrict") {
        console.warn("preference type " + preferenceType + " bad. bug!");
        return;
    }

    var quoted = foodName.replace("\"", "\\\"");
    $("#prefer-list button[data-food-name=\"" + quoted + "\"]").remove();
    $("#restrict-list button[data-food-name=\"" + quoted + "\"]").remove();

    var $targetList = $("#" + preferenceType + "-list");
    var $button = $("<button class='btn btn-medium'><i class='icon-remove'></i></button>")
        .append(" " + foodName).attr("data-food-name", foodName)
        .click(function() {
            $(".picker[data-food-name=\"" + quoted + "\"] button").removeClass("active");
            setPreference(foodName, undefined);
        });
    $targetList.append($button);
}

var clearPreferenceType = function(preferenceType) {
    $("#" + preferenceType + "-list").empty();
    $(".picker button." + preferenceType).removeClass("active");
}
