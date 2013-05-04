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
        "click .prefer": "prefer",
        "click .neutral": "neutral",
        "click .restrict": "restrict"
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
