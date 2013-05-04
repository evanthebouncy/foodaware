function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function toIdentifier(str) {
    return str.replace(/ /g, "_");
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
               description: "Eat your greens!",
               ingredients: ["Lettuce", "Tomato", "Vinegar", "Green Beans"],
               image: "Menu_Resources/salad.jpg"
              },
              {itemName: "BLT",
               description: "A classic.",
               ingredients: ["Pork", "Lettuce", "Tomato", "Bread", "Gluten"],
               image: "Menu_Resources/blt.jpg"
              }
            ]

var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var SelectedDish;

var itemCount = 0;


var itemScore = function(item) {
    var count = 0;
    for (var i = 0; i < item.ingredients.length; i++) {
        if (settings[item.ingredients[i]] == "prefer")
            count++;
    }

    return count;
}

$(document).ready(function() {
    Parse.User.logIn("janedoe", "janedoe", function(user) {
        var query = new Parse.Query(Settings);
        query.equalTo("user", user).first({
            success: function(settings) {
                setupMenu(settings);
            },

            error: function(settings, error) {
                console.error("Something went wrong getting user data:", error);
                setupMenu(settings);
            }});
    });
});


var setupMenu = function(settings) {
    // Set up the valence groups on the side.
    preferenceValenceGroup = new ValenceGroup({type: "prefer",
                                               hasClear: true,
                                               model: settings});
    restrictionValenceGroup = new ValenceGroup({type: "restrict",
                                                hasClear: true,
                                                model: settings});

    $("#valence-groups").append(preferenceValenceGroup.render().el)
        .append(restrictionValenceGroup.render().el);

    settings.on("change", _.debounce(function() {
        settings.save(null, {
            success: function() {
                console.log("Successfully saved!");
            },

            error: function(obj, error) {
                console.error("Save failure: ", error);
            }
        });

        populateThumbnails(settings);
    }), 300);


    populateThumbnails(settings);
}


var populateThumbnails = function(settings) {

    var itemTemplate = Handlebars.compile($("#item-template").html());
    selectionWindow = document.getElementById("dish_selection");

    // Populate the thumbnails template.
    var thumbnailsTemplate = Handlebars.compile($("#thumbnails-template").html());

    var itemScore = function(item) {
        var count = 0;
        for (var i = 0; i < item.ingredients.length; i++) {
            if (settings.get(toIdentifier(item.ingredients[i])) == "prefer")
                count++;
        }

        return count;
    }

    menuItems.sort(function(a, b) {
        return itemScore(b) - itemScore(a);
    });

    var filteredItems = $.grep(menuItems, function(item) {
        for (var i = 0; i < item.ingredients.length; i++) {
            if (settings.get(toIdentifier(item.ingredients[i])) == "restrict") {
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

                var ingredientButtons = _.map(item.ingredients, function(ingredient) {
                    button = new ValenceButton({displayName: ingredient,
                                                model: settings});
                    return button.render().$el;
                });
                $(selectionWindow).find(".ingredient_list").append(ingredientButtons);
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
