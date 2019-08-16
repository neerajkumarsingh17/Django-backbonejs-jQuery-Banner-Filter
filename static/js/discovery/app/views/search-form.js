define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/search-form.html');

    return Backbone.View.extend({

        id: 'search-form',
        $el: null,
        form_data: null,
        events: {
            "submit #search-form": "search",
        },
        initialize: function(left_nav) {
            this.$el = $("#" + this.id);
            this.render();
            this.left_nav = left_nav.left_nav;
        },

        render: function() {
            var template = _.template(tpl);
            return this.$el.html(template());
        },

        search: function(e) {
            e.preventDefault();
            var search_string = $("#discovery-input").val();
            var course_model = this.left_nav.course_card_model;
            var course_view = this.left_nav.course_card_view;
            course_view.reset();

            var options = {
                "search_string": search_string,
            }
            course_model.all = true;
            course_model.fetch_data(options);

        }
    });
});