function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

food = { "dairy": ["eggs", "milk", "butter", "ice cream"],
         "meat": ["pork", "steak", "veal"],
         "vegetables": ["carrots", "pickles", "onions"] };

foodGroups = ["meat", "vegetables", "dairy"];

$(document).ready(function() {
    var source = $("#picker-template").html();
    var pickerTemplate = Handlebars.compile($("#picker-template").html());
    var dairy = pickerTemplate({groupName: "dairy", itemName: food["dairy"]});
    $.each(foodGroups, function(index, group) {
        var restrictionResult = pickerTemplate({groupName: ucFirst(group), itemName: $.map(food[group], ucFirst),
                                               prefType: "restriction"});
        var preferenceResult = pickerTemplate({groupName: ucFirst(group), itemName: $.map(food[group], ucFirst),
                                               prefType: "preference"});
        $("#restriction-chooser").append(restrictionResult);
        $("#preference-chooser").append(preferenceResult);
    });

    $("div.picker button").click(function(eventObj) {
        $(this).closest(".picker").toggleClass("checked");

        // Un-prefer the item if we just restricted it, and
        // vice-versa.
        var preferenceType = $(this).closest(".food-chooser").attr("id").split("-")[0];
        var otherType = preferenceType == "preference" ? "restriction" : "preference";
        var otherName = $(this).closest(".accordion-body").attr("id").replace(preferenceType, otherType);
        console.log(otherName);
        $("#" + otherName + " .picker").removeClass("checked");
    });

});
