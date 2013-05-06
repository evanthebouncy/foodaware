function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function toIdentifier(str) {
    return str.replace(/ /g, "_");
}

menuItems = null;

var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;

var selected_dishes = [];
function add_dish(dish){
  if ($.inArray(dish, selected_dishes) == -1){
    selected_dishes.push(dish);

    var selected_dish = $('<div/>', {
      id:dish
    });

    var button_remove = $('<button/>', {
      id: dish+"_close",
      click: function (e) {
        var dish_name = $(e.target).parent().attr('id');
        remove_dish(dish_name);
      }
    }).appendTo(selected_dish);

    button_remove.append("<i class=\"icon-remove-sign\"></i>");

    var button = $('<button/>', {
      text: dish, //set text 1 to 10
      id: dish+"_view",
      click: function () {
      }
    }).appendTo(selected_dish);

    console.log(button);
    button.addClass("btn view_btn");
    button_remove.addClass("btn close_btn");

    $("#selected_dishes").append(selected_dish);
  } 
}

function remove_dish(dish){
  var index_of = selected_dishes.indexOf(dish);
  selected_dishes.splice(index_of,1);
  var elem = document.getElementById(dish);
  elem.parentNode.removeChild(elem);
}

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
  pull_restaurant_index(to_run_after_we_get_restaurant_index);
});

//when the body of this function is invoked
//we would've already know the restaurant index which the user selected
//on the previous page OH YEAH!
var to_run_after_we_get_restaurant_index = function (index){
  console.log("PLEASE HAVE INDEX" + index);

//fake thing we gonna remove later

  console.log(restaurants);
  var restaurant = restaurants[index];
  $("#restaurant_logo").attr("src", "menu_ingr_data/rest_picture/"+restaurant.logo);
  menuItems = restaurant["dishes"];
  console.log(menuItems);
  
  var user = Parse.User.current();
  var query = new Parse.Query(Settings);
  query.equalTo("user", user).first({
      success: function(settings) {
          setupMenu(settings);
          },

      error: function(settings, error) {
          console.error("Something went wrong getting user data:", error);
          setupMenu(settings);
      }});

  $("#print_summary").click(
    function(){
      push_dish_select(selected_dishes,
        function() {
          window.location ="summary.html";
        }
      );
    }
  )
}

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
            console.log(item.name);
            if (item.name == targetFoodName) {
                $(selectionWindow).html(itemTemplate(item));

                item.ingredients.sort();
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
            
            add_dish($("#DishNameLabel").html());
            $("#SelectionCount").text(itemCount + " item(s)");
            //$("#add-message").text("Added!");
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
