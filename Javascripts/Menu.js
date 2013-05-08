function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function toIdentifier(str) {
    return str.replace(/ /g, "_").toLowerCase();
}

function toDisplayName(str) {
    return ucFirst(str.replace(/_/g, " "));
}

menuItems = null;

var center_display = $('menu_display');
var selectedDiv;
var selectionWindow;
var totalPrice = 0;
var restaur_index;

//  $("#selected_dishes").html("");

//view for dishes
var selected_dishes = [];

var CartButtonView = Parse.View.extend({
    template: Handlebars.compile($("#cart-button-template").html()),
    tagName: "div",
    className: "btn-group",

    events: {
        "click .cart-remove": "removeItem"
    },

    removeItem: function() {
        this.model.remove("cart", this.options.itemName);
        this.model.save();
    },

    render: function() {
        this.$el.html(this.template(this.options));
        return this;
    }
});


var ShoppingCartView = Parse.View.extend({
    template: Handlebars.compile($("#cart-template").html()),
    tagName: "div",

    initialize: function() {
        _.bindAll(this, "render");
        this.model.bind("change:cart", this.render);
    },

    render: function() {
        this.$el.html(this.template());
        var self = this;
        var totalPrice = 0;
        _.each(this.model.get("cart"), function(itemName) {
            var buttonView = new CartButtonView({itemName: itemName,
                                                model: self.model});
            self.$el.find("#selected_dishes").append(buttonView.render().$el);
            // This is stupid, but I don't have time to go through and
            // fix the data.
            _.each(self.options.dishes, function(dish) {
                if (dish.name == itemName)
                    totalPrice += parseFloat(dish.price);
            });
        });

        this.$el.find("#total_price_label").text("$" + (Math.round(100 * totalPrice) / 100));
        return this;
    }
});

$(document).ready(function() {
    //request restaurant_index and dishes_list from Parse Cloud
    //once they're in, render the page
    var user = Parse.User.current();
    user.fetch({success: function(user_) {
        multi_pull([pull_restaurant_index, pull_dishes_list], menu_page_render)
    }});

});

//when the body of this function is invoked
//we would've already know the restaurant index which the user selected
//on the previous page OH YEAH!
var menu_page_render = function (list_args) {
  //initialize values based on what Parse gave back
  console.log("logging args");
  console.log(list_args);
  restaur_index = list_args[0];
  selected_dishes = list_args[1];

  //kick you back
  if(restaur_index == -1)
  {
	  window.location = "filter.html";
  }

  //var selected_dishes_view = new SelectedDishesView({collection: selected_dishes});

  var user = Parse.User.current();
  var restaurant = restaurants[restaur_index];
  $("#restaurant_logo").attr("src", "menu_ingr_data/rest_picture/"+restaurant.logo);
  menuItems = restaurant["dishes"];

    var cartView = new ShoppingCartView({model: user,
                                        dishes: restaurant.dishes})
    $("#cart").append(cartView.render().$el);


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

  //some dirty hack...
  //check if the restaurant contains the current dishes, if it doesn't, it's a diff restaurant
  //had to resort to this as we didn't push along with dish_selected the restaurant it came from
  if (selected_dishes.length > 0){
    var try_dish = selected_dishes[0];
    var same_rest = false;
    _.each(menuItems, function(item){
      if(item.name == try_dish){
        same_rest = true;
      }
    });
    //clear the selected_dishes if the restaurant is different
    if (same_rest == false){
      selected_dishes = [];
    }
  }
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
    var user = Parse.User.current();
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
                    button = new ValenceButton({displayName: toDisplayName(ingredient),
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
          user.addUnique("cart", $("#DishNameLabel").html());
          user.save();
          selectionWindow.style.display = "none";
			    selectedDiv.style.border = "1px solid #dddddd";
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
