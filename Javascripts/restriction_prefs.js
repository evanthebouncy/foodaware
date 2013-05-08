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


var ValenceFilterView = Parse.View.extend({
    events: {
        "submit": function(ev) { ev.preventDefault(); },
        "change input": function() { console.log("hi"); }
    },

    initialize: function() {
        _.bindAll(this, "render");
        this.$el.html("<form><input><div class='well'></div></form>");
        this.$el.find("form").addClass("form-search");
        this.$input = this.$el.find("input");
        this.$input.attr("placeholder", "Ingredient name")
            .addClass("input-medium search-query")
            .attr("type", "text")
            .keyup(this.render);
        this.$output = this.$el.find("div");
        this.options.ingredientList.sort();
        var self = this;
        var valenceButtons = _.map(this.options.ingredientList, function(ingredient) {
            var button = new ValenceButton({ model: self.model,
                                             displayName: toDisplayName(ingredient)
                                           });
            button.render();
            button.$el.hide();
            return button;
        });
        this.valenceButtons = valenceButtons;
        this.$output.append(_.map(valenceButtons, function(button) { return button.$el }));
    },

    render: function() {
        var filterValue = this.$input.val().toLowerCase();;
        console.log(filterValue);
        _.each(this.valenceButtons, function(button) {
            console.log(button);
            if (filterValue && button.options.displayName.toLowerCase().indexOf(filterValue) > -1) {
                button.$el.show();
            } else {
                button.$el.hide();
            }
        });


        return this;
    }
});


$(document).ready(function() {
    var user = Parse.User.current();
    var query = new Parse.Query(Settings);
    query.equalTo("user", user).first({
        success: function(settings) {
                setupEntrySystem(settings || new Settings({user: user}));
        },

        error: function(settings, error) {
            console.log("no settings found, using default");
            setupEntrySystem(settings || new Settings({user: user}));
        }});
});

// This actually sets up all the data entry options; we call it once
// we have the existing settings.
var setupEntrySystem = function(settings) {
    var ingredientList = [];

    $.each(ingredientGroups, function(index, group) {
        ingredientList = ingredientList.concat(ingredients[group]);
        var itemButtons = $.map(ingredients[group], function(itemName) {
            return new ValenceButton({displayName: ucFirst(itemName),
                                      model: settings
                                     });
        });

        var group = new ChooserGroup({subviews: itemButtons,
                                   groupName: ucFirst(group),
                                   model: settings});
        $("#chooser").append(group.render().el);
    });

    preferenceValenceGroup = new ValenceGroup({type: "prefer",
                                               hasClear: true,
                                               model: settings});
    restrictionValenceGroup = new ValenceGroup({type: "restrict",
                                                hasClear: true,
                                                model: settings});

    $("#valence-groups").append(preferenceValenceGroup.render().el)
        .append(restrictionValenceGroup.render().el);

    var filter = new ValenceFilterView({ingredientList: ingredientList,
                                       model: settings});
    $("#search").append(filter.render().$el);


    // Set up automatic debounced saving.
    settings.on("change", _.debounce(function() {
        settings.save(null, {
            success: function() {
                console.log("Successfully saved!");
            },

            error: function(obj, error) {
                console.error("Save failure: ", error);
                    }
        })
    }), 300);


}
