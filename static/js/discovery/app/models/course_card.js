define(function(require) {

    "use strict";

    var $ = require('jquery'),
        cookie = require('cookie'),
        Backbone = require('backbone');

    return Backbone.Model.extend({
        url: "/search/course_discovery/",
        fetch_data: function(options) {
            var model = this;
            $.ajax({
                url: '/search/course_discovery/',
                type: 'POST',
                dataType: 'json',
                data: options,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
                },
                success: function(object, status) {
                    model._reqComplete(object);
                }
            });
        },
        _reqComplete: function(results) {
            this.set("results", null);
            this.set("results", results);
            if(results.total==0){
                $('#data_not_found_course_msg').html("<div style='color:#63c2ce;text-align: -webkit-center;'>Did not match any Courses.</div>");
            }else{
                $('#data_not_found_course_msg').html("");
            }
        },
        resetState: function() {
            this.page = 0;
            this.totalCount = 0;
            this.attributes.results = [];
        },
    });

});