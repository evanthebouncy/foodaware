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
    });

    $("#clear-restrictions").click(function() {
        clearPreferenceType("restriction");
    });
    $("#clear-preferences").click(function() {
        clearPreferenceType("preference");
    })

    // Set up handlers.
    $(".picker button.prefer").click(function() {
        var foodName = $(this).closest("div.picker").attr("data-food");
        setPreference(foodName, "prefer");
    });

    $(".picker button.restrict").click(function() {
        var foodName = $(this).closest("div.picker").attr("data-food");
        setPreference(foodName, "restrict");
    });
});


var setPreference = function(itemName, preferenceType) {
    alert("ok");
}
