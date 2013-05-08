Parse.initialize("NJaqeDB583JMB1TdWF2Tkpwkn9UbFsOOMhxhhPds", "69wSIovgcpBxqhsdhjlgohBJ2cTWGD3O1Y8JHQET");

// Uppercase the first letter of a string.
function ucFirst(str) {
    return str.toLowerCase().replace(/^[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

function toIdentifier(str) {
    return str.replace(/ /g, "_").toLowerCase();
}

var Settings = Parse.Object.extend("Settings");

var ValenceButton = Parse.View.extend({
    template: Handlebars.compile($("#valence-template").html()),

    tagName: "div",
    attributes: function() {
        return {
            class: "picker btn-group",
            id: this.options.identifier,
            "data-food-id": this.options.identifier,
            "data-food-name": this.options.displayName
        }
    },

    events: {
        "click .prefer": "togglePrefer",
        "click .neutral": "neutral",
        "click .restrict": "toggleRestrict"
    },

    togglePrefer: function() {
        var valence = this.model.get(this.options.identifier);
        if (valence == "prefer")
            this.neutral();
        else
            this.prefer();
    },

    toggleRestrict: function() {
        var valence = this.model.get(this.options.identifier);
        if (valence == "restrict")
            this.neutral();
        else
            this.restrictw();
    },


    prefer: function() {
        this.model.set(this.options.identifier, "prefer");
    },
    neutral: function() {
        this.model.unset(this.options.identifier);
    },
    restrict: function() {
        this.model.set(this.options.identifier, "restrict");
    },

    initialize: function() {
        _.bindAll(this, "render");
        this.options.identifier = toIdentifier(this.options.displayName);
        // We only listen to when our own attribute is changed.
        this.model.bind("change:" + this.options.identifier, this.render);
    },

    render: function() {
        this.$el.html(this.template(this.options));

        var valence = this.model.get(this.options.identifier);
        if (valence == "prefer") {
            this.$el.find(".prefer").addClass("active");
        } else if (valence == "restrict") {
            this.$el.find(".restrict").addClass("active");
        }
        return this;
    }
});


// Represents a group of valence buttons.
var ChooserGroup = Parse.View.extend({
    template: Handlebars.compile($("#chooser-template").html()),

    tagName: "div",
    className: "chooser-group accordion-group",

    events: {
        "click .restrict": "restrict"
    },

    restrict: function() {
        _.each(this.options.subviews, function(subview) {subview.restrict()});
        // Return false here so that it doesn't accidentally toggle
        // the menu.
        return false;
    },

    render: function() {
        var el = this.$el
        el.html(this.template(this.options));

        _.each(this.options.subviews, function(subview) {
            el.find(".accordion-inner").append(subview.render().el);
        });

        // Delegate events out so that we don't wind up rerendering
        // everything.
        this.delegateEvents();
        return this;
    }
});

// A group of options with the same valence; optionally, it can have a
// 'clear all' button.
var ValenceGroup = Parse.View.extend({
    template: Handlebars.compile($("#valence-group-template").html()),

    tagName: "div",
    className: "valence-group",

    events: {
        "click .clear": "clearAll"
    },

    // Clear all settings with the given valence. This fires off a lot
    // of changed events, but eh.
    clearAll: function() {
        var self = this;
        _.each(_.clone(this.model.attributes), function(valence, name) {
            if (valence == self.options.type) {
                self.model.unset(name);
            }
        });
    },

    initialize: function() {
        _.bindAll(this, "render");
        this.model.bind("change", this.render);
    },

    render: function() {
        // Get the sorted list of items with the relevant valence out.
        var valenceNames = [];
        var self = this;
        _.each(this.model.attributes, function(valence, name) {
            if (valence == self.options.type) {
                valenceNames.push(name);
            }
        });
        valenceNames.sort();

        // Construct the buttons.
        var buttons = _.map(valenceNames, function(name) {
            var $remove = $("<i>").addClass("icon-remove");
            return $("<button>").addClass("btn btn-medium").append($remove)
                .append(" " + ucFirst(name).replace(/_/g, " ")).click(function() {self.model.unset(name)});
        });


        var renderOpts = {
            type: this.options.type,
            hasClear: this.options.hasClear,
            typeNoun: this.options.type == "prefer" ? "preferences" : "restrictions"
        };
        this.$el.html(this.template(renderOpts));

        this.$el.find(".food-list").append(buttons);

        return this;
    }
});
