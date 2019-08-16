define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/course_info_modal.html'),
        bootstrap = require('bootstrap'),
        template = _.template(tpl);

    return Backbone.View.extend({

        id: 'base-modal',
        className: 'modal fade',

        events: {
            "click .close-btn": "close"
        },

        initialize: function() {
            _.bindAll(this, 'show', 'render', 'renderView');
            bootstrap;
        },

        show: function(course) {
            $("#base-modal").remove();
            this.$el.modal('show');
            this.render(course);
        },

        render: function(course) {
            return this.$el.html(template(course))
        },

        renderView: function(template) {
            this.$el.html(template());
        },
        close: function() {
            this.$el.modal('hide');
        },
    });
});