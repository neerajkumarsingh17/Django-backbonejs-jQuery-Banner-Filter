define(function(require) {

    "use strict";

    var $ = require('jquery'),
        cookie = require('cookie'),
        Backbone = require('backbone');

    return Backbone.Model.extend({
        url: "/search/course_discovery/",
        fetch_all: function(options) {
            var model = this;
            $.ajax({
                url: '/search/course_discovery/',
                type: 'POST',
                dataType: 'json',
                data: model.toJSON(),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
                },
                success: function(object, status) {
                    model._reqComplete(object.facets);

                }
            });
        },
        _reqComplete: function(results) {
            this.set("data", null);
            this.set("data", results);
        },
    });

});