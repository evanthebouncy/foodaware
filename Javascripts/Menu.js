function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

menuItems = [ {itemName: "Scrambled eggs",
               description: "Good for protein!",
               ingredients: ["Eggs", "Cheese", "Lactose"],
               image: "Menu_Resources/eggs.jpg"
              },
              {itemName: "Grilled cheese",
               description: "Goes great with tomato soup",
               ingredients: ["Bread", "Cheese", "Gluten"],
               image: "Menu_Resources/grilled cheese.jpg"
              },
              {itemName: "Salad",
               description: "What are you, a rabbit?",
               ingredients: ["Lettuce", "Tomato", "Vinegar", "Green Beans"],
               image: "Menu_Resources/salad.jpg"
              },
              {itemName: "BLT",
               description: "A classic.",
               ingredients: ["Bacon", "Lettuce", "Tomato", "Bread", "Gluten"],
               image: "Menu_Resources/blt.jpg"
              }
            ]

var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var SelectedDish;

var itemCount = 0;

var settings = {"Vinegar": "restrict",
                "Bacon": "prefer"};

var itemScore = function(item) {
    var count = 0;
    for (var i = 0; i < item.ingredients.length; i++) {
        if (settings[item.ingredients[i]] == "prefer")
            count++;
    }

    return count;
}

$(document).ready(function() {
    reloadSettings();

});


var reloadSettings = function() {
    var itemTemplate = Handlebars.compile($("#item-template").html());
    selectionWindow = document.getElementById("dish_selection");

    var preferences = [];
    var restrictions = [];
    $.each(settings, function(ingredient, setting) {
        if (setting == "prefer") {
            preferences.push(ingredient);
        } else if (setting == "restrict") {
            restrictions.push(ingredient);
        }
    });
    restrictions.sort();
    $("#restrictions_main").empty();
    $.each(restrictions, function(unused, item) {
        var $button = makeRemoverButton(item, "restrict");
        $("#restrictions_main").append($button);
    });

    preferences.sort();
    $("#preferences_main").empty();
    $.each(preferences, function(unused, item) {
        var $button = makeRemoverButton(item, "prefer");
        $("#preferences_main").append($button);
    });

    // Populate the thumbnails template.
    var thumbnailsTemplate = Handlebars.compile($("#thumbnails-template").html());
    menuItems.sort(function(a, b) {
        return itemScore(b) - itemScore(a);
    });
    var filteredItems = $.grep(menuItems, function(item) {
        for (var i = 0; i < item.ingredients.length; i++) {
            if (settings[item.ingredients[i]] == "restrict") {
                return false;
            }
        }
        return true;
    });

    $("#thumbnails").empty().append(thumbnailsTemplate(filteredItems));

    $('.thumbnail').click(function() {
        var targetFoodName = $(this).attr("data-food-name");
        console.log(targetFoodName);
        $(menuItems).each(function(unused, item) {
            console.log(item.itemName);
            if (item.itemName == targetFoodName) {
                $(selectionWindow).html(itemTemplate(item));
                return false;
            }
        });

	if(selectedDiv != null) {
	    selectedDiv.style.border = "1px solid #dddddd";
	}
	selectedDiv = this;
	selectedDiv.style.border = "1px solid green";
	selectionWindow.style.display = "block";

        $('#close_selection_button').click(function(event) {
	    selectionWindow.style.display = "none";
	    selectedDiv.style.border = "1px solid #dddddd";
        });


        // Set up 'like' and 'dislike' buttons.
        $('.ingredient_option_like').click(function() {
            var ingredient = $(this).closest(".ingredient_option")
                .attr("data-ingredient-name");
            if (toggle(ingredient, "prefer")) {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }

            reloadSettings();
        }).each(function() {
            var ingredient = $(this).closest(".ingredient_option")
                .attr("data-ingredient-name");
            if (settings[ingredient] == "prefer")
                $(this).addClass("active");
        });
        $('.ingredient_option_dislike').click(function() {
            var ingredient = $(this).closest(".ingredient_option")
                .attr("data-ingredient-name");
            if (toggle(ingredient, "restrict")) {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }

            reloadSettings();
        }).each(function() {
            var ingredient = $(this).closest(".ingredient_option")
                .attr("data-ingredient-name");
            if (settings[ingredient] == "restrict")
                $(this).addClass("active");
        });

        $('.ingredient_option_name').click(function() {
            var ingredient = $(this).closest(".ingredient_option")
                .attr("data-ingredient-name");
            $(this).siblings().removeClass("active");
            settings[ingredient] = undefined;
            reloadSettings();
        });

    // Global Event Listeners
    $('#order_button').click(function(event) {
        itemCount++;
        $("#SelectionCount").text(itemCount + " item(s)");
        $("#add-message").text("Added!");
    });


    });

    $('.thumbnail').hover(
        function() {
	    if (this == selectedDiv) {
	        return;
	    } else {
	        $(this).css("border","1px solid black");
	    }},
	function() {
	    if(this == selectedDiv) {
		return;
	    } else {
		$(this).css("border","1px solid #dddddd");
	    }
	});
}

// Create a 'remover' button of the given type (i.e., 'prefer' or
// 'restrict'); when clicked, it'll remove the relevant item from the
// setting list and reload.
function makeRemoverButton(item, type) {
    return  $("<button class='btn btn-medium'><i class='icon-remove'></i></button>")
        .append(" " + item).attr("data-food-name", item)
        .click(function() {
            settings[item] = undefined;
            reloadSettings();
        });
}


var toggle = function(item, setting) {
    if (settings[item] == setting) {
        settings[item] = undefined;
        return false;
    } else {
        settings[item] = setting;
        return true;
    }
}
