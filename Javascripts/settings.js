var Settings = Parse.Object.extend("Settings");

var ValenceButton = Parse.View.extend({
    template: Handlebars.compile($("#valence-template").html()),
    tagName: "div",
    className: "picker btn-group",

    events: {
        "click .prefer": "prefer",
        "click .neutral": "neutral",
        "click .restrict": "restrict"
    },

    prefer: function() {
        this.model.set(this.options.identifier, "prefer");
    },
    neutral: function() {
        this.model.unset(this.options.identifier, "prefer");
    },
    restrict: function() {
        this.model.set(this.options.identifier, "restrict");
    },

    initialize: function() {
        _.bindAll(this, "render");
        this.model.bind("change", this.render);
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
