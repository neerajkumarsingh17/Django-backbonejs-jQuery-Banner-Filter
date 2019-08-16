define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/course_card.html'),
        tpl_new = require('text!tpl/course_card_new.html'),
        model = require('app/models/course_card'),
        slick = require('slick'),
        modal_dialog = require('app/views/modal'),
        bootstrap = require('bootstrap'),
        page = 0,
        page_size = 3,
        template = _.template(tpl),
        new_template = _.template(tpl_new);
        

    return Backbone.View.extend({

        $el: null,
        initialize: function() {
            self = this;
            this.model.all = false;
            this.all_courses = [];
            this.categories = self.options.categories;
            this.get_all_courses();
            this.model.on("change:results", self.render, self);
            this.courses_data = {};
        },
        get_category_id: function(category) {
            category = category.toLowerCase().replace(/ /g, '_');
            return category;
        },
        get_all_courses: function() {
            self = this;
            for (var i = 0; i < this.categories.length; i++) {

                try{
                    var options = {
                        "categories": this.categories[i],
                    };
                    var category_id = this.get_category_id(this.categories[i]);
                    this.$el = $(".video-list-slider");
                    var el = $("#" + category_id + " .video-list-slider");
                    el.slick({
                        slidesToShow: 5,
                        infinite: false,
                        slidesToScroll: 5,
                    });

                    self.model.fetch_data(options);
                }catch(e){
                    console.log("Category isssue: "+this.categories[i]);
                }
            }
        },
        array_exist: function(array, elem){
            return array.indexOf(elem) > -1;
        },
        render: function() {
            var self = this;
            var courses_resp = this.model.attributes.results;
            var facets = null;
            var courses = null;
            if (this.model.all != true) {
                if (courses_resp != null) {
                    facets = courses_resp.facets;
                    courses = courses_resp.results;
                    Array.prototype.push.apply(this.all_courses, courses);

                    for (var i = 0; i < courses.length; i++) {
                        var course = courses[i];
                        if (course.data.categories != null) {

                            var categories = course.data.categories;
                            if (course.data.categories.constructor === Array) {
                                for (var j = 0; j < categories.length; j++) {
                                    try{
                                        var category_id = this.get_category_id(categories[j]);
                                        if(typeof this.courses_data[category_id] === 'undefined'){
                                            this.courses_data[category_id] = [];
                                        }
                                        if(!this.array_exist(this.courses_data[category_id], course.data.id)){
                                            this.courses_data[category_id].push(course.data.id);
                                            if (category_id != "") {
                                                var slick = $('#' + category_id + " .video-list-slider").slick('slickAdd', template(courses[i].data));
                                                $('#' + category_id).show();
                                            }
                                        }
                                    }catch(e){}
                                }
                            } else {
                                try{
                                    var category_id = this.get_category_id(categories);
                                    if (category_id != "") {
                                        var slick = $('#' + category_id + " .video-list-slider").slick('slickAdd', template(courses[i].data));
                                        $('#' + category_id).show();
                                    }
                                }catch(e){}
                            }
                        }
                    }

                    var categories = facets.categories.terms;

                    for (var key in categories) {
                        if (categories.hasOwnProperty(key)) {
                            try{
                                category_id = self.get_category_id(key);
                                $('#' + category_id).find('.course-count').html("(" + categories[key] + ")");
                            }catch(e){}
                        }
                    }
                }
            } else {
                if (courses_resp != null) {
                    facets = courses_resp.facets;
                    courses = courses_resp.results;
                    $('#all-courses').find('.video-list-slider').html("");
                    $('#all-courses').show();
                    // sorting courses card accoding to display_name
                    courses.sort(compare)
                    function compare( a, b ) {
                        if ( a.data.content.display_name < b.data.content.display_name ){  
                          return -1;  
                        }  
                        if ( a.data.content.display_name > b.data.content.display_name ){  
                          return 1;  
                        }  
                        return 0;  
                      }
                    //end sorting
                    Array.prototype.push.apply(this.all_courses, courses);
                    for (var i = 0; i < courses.length; i++) {
                        var course = courses[i];
                        $("#all-courses").find('.video-list-slider').append(template(courses[i].data));
                    }
                }
            }
            return this;
        },
        events: {
            "click .video-slide": "showCourseInfo"
        },

        showCourseInfo: function(e) {

            
            e.preventDefault();
            var course_id = $(e.currentTarget).attr("data-pk");
            var course = this.getSelectedCourseData(course_id);
            var m = new modal_dialog();
            m.show(course);
        },

        getSelectedCourseData: function(course_id) {
            var courses = this.all_courses;
            for (var i = 0; i < courses.length; i++) {
                var course = courses[i].data;
                if (course.id == course_id) {
                    return course;
                }
            }
        },

        reset: function() {
            for (var i = 0; i < this.categories.length; i++) {
                var options = {
                    "categories": this.categories[i],
                };
                var category_id = this.get_category_id(this.categories[i]);
                $('#' + category_id + " .video-list-slider").slick('removeSlide', null, null, true);
                $('#' + category_id).hide();
            }
            this.all_courses = [];
            this.model.resetState();
        }

    });
});