function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

menuItems = [ {itemName: "Scrambled eggs",
               description: "Good for protein!",
               ingredients: ["Eggs", "Cheese", "Lactose"],
               image: "Menu_Resources/Prawn-Pad-Thai.png"
              },
              {itemName: "Grilled cheese",
               description: "Goes great with tomato soup",
               ingredients: ["Bread", "Cheese", "Gluten"],
               image: "Menu_Resources/Prawn-Pad-Thai.png"
              },
              {itemName: "Salad",
               description: "What are you, a rabbit?",
               ingredients: ["Lettuce", "Tomato", "Vinegar"],
               image: "Menu_Resources/Prawn-Pad-Thai.png"
              },
              {itemName: "BLT",
               description: "A classic.",
               ingredients: ["Bacon", "Lettuce", "Tomato", "Bread", "Gluten"],
               image: "Menu_Resources/Prawn-Pad-Thai.png"
              }
            ]

var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var SelectedDish;
var restrictions = ["Vinegar"];
var preferences = ["Bacon"];


var itemScore = function(item) {
    var count = 0;
    for (var i = 0; i < item.ingredients.length; i++) {
        if (preferences.indexOf(item.ingredients[i]) > -1) {
            count++;
        }
    }

    return count;
}

$(document).ready(function() {
    var itemTemplate = Handlebars.compile($("#item-template").html());
    selectionWindow = document.getElementById("dish_selection");

    reloadSettings();

    // Global Event Listeners
    $('#order_button').click(function(event) {
	selectionWindow.style.display = "none";
	selectedDiv.style.border = "1px solid #dddddd";
    });
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

        $('.ingredient_option_like').click(function() {
	    $(this).addClass("active");
	    var par = $(this).parent();
	    var child = par.children(".ingredient_option_dislike");
	    $(child[0]).removeClass("active");
        });
        $('.ingredient_option_dislike').click(function() {
	    $(this).addClass("active");
	    var par = $(this).parent();
	    var child = par.children(".ingredient_option_like");
	    $(child[0]).removeClass("active");
        });
        $('.ingredient_option_name').click(function() {
	    var par = $(this).parent();
	    var child = par.children(".ingredient_option_like");
	    $(child[0]).removeClass("active");
	    var child2 = par.children(".ingredient_option_dislike");
	    $(child2[0]).removeClass("active");
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

    center_display.filter = function(event) {
	console.log("testing dynamic filter");
    };
});


var reloadSettings = function() {
    restrictions.sort();
    $("#restrictions_main").empty();
    $(restrictions).each(function(unused, item) {
        var $button = makeRemoverButton(item, "restrict");
        $("#restrictions_main").append($button);
    });

    preferences.sort();
    $("#preferences_main").empty();
    $(preferences).each(function(unused, item) {
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
            if (restrictions.indexOf(item.ingredients[i]) > -1) {
                return false;
            }
        }
        return true;
    });

    $("#thumbnails").empty().append(thumbnailsTemplate(filteredItems));
}

function makeRemoverButton(item, type) {
    return  $("<button class='btn btn-medium'><i class='icon-remove'></i></button>")
        .append(" " + item).attr("data-food-name", item)
        .click(function() {
            if (type == "prefer") {
                var index = preferences.indexOf(item);
                preferences.splice(index, 1);
            } else {
                var index = restrictions.indexOf(item);
                restrictions.splice(index, 1);
            }
            reloadSettings();
        });
}
