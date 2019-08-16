define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/left-nav.html'),
        tpl2 = require('text!tpl/course_category.html'),
        CourseCardModel = require('app/models/course_card'),
        CourseCardView = require('app/views/course_card'),
        filterOption = {};


    return Backbone.View.extend({

        id: 'left-nav',
        courses_category: 'video-list-container',
        $category_el: null,
        $el: null,
        events: {
            "click #lngFilter :checkbox": "lngFilter",
            "click .levels": "levels",
            "click .display_organization": "display_organization",
            "click .close-btn": "close_btn",
        },
        initialize: function() {
            this.$el = $("#" + this.id);
            this.$category_el = $("#" + this.courses_category);

            var self = this;

            // model fetch
            this.model.fetch_all();
            this.model.on("change:data", self.render, self);
        },

        get_categories: function(data) {
            var arr = [];
            for (var key in data.data.categories.terms) {
                if (key != '') {
                    arr.push(key);
                }
            }
            return arr;
        },
        get_language: function(data) {
            var arr = [];
            for (var key in data.data.language.terms) {
                if (key != '') {
                    arr.push(key);
                }
            }
            return arr;
        },
        render: function() {
            var constDesc = [];
            constDesc.push({ type: "category", key: "Planning and Execution", desc: "" });
            constDesc.push({ type: "category", key: "Building Relationships and Investing Others", desc: " " });
            constDesc.push({ type: "category", key: "Vision and Big Goals", desc: "" });
            constDesc.push({ type: "category", key: "Reflective Practice", desc: "" });
            constDesc.push({ type: "category", key: "Reflective Practice", desc: "" });
            constDesc.push({ type: "category", key: "Classroom Instruction", desc: "Through this category of courses, we will learn to plan for and execute lessons and units of instructions effectively. This category includes all aspects of classroom instruction including catering to diverse learner needs" });
            constDesc.push({ type: "category", key: "Classroom Culture", desc: "Through this category of courses, we will learn to create, maintain and spread a culture of support and learning to our students in the classroom at and beyond the scope of the classroom." });
            constDesc.push({ type: "category", key: "Self Development", desc: "Through this category of courses, we will learn to grow at a personal and professional level." });
            constDesc.push({ type: "category", key: "School and Community", desc: "Through this category of courses, we will learn ways to build relationships with and invest members of school and community towards student outcomes " });
            constDesc.push({ type: "category", key: "Educational Landscape", desc: "Through this category of courses, we will learn about the events that transpire in India's education landscape and the impact it has on our classrooms and students" });
            constDesc.push({ type: "category", key: "Subject Instruction", desc: "Through this category of courses, we will learn ways to prepare for and deliver instruction for different subject areas effectively." });

            var self = this;

            try {
                var d = {};
                for (const level of Object.keys(
                        this.model.attributes.data.levels.terms
                    ).sort()) {
                    d[level] = this.model.attributes.data.levels.terms[level];
                }
                this.model.attributes.data.levels.terms = d;
            } catch (error) {}

            //category
            try {
                var c = {};
                for (const level of Object.keys(
                        this.model.attributes.data.categories.terms
                    ).sort()) {
                    c[level] = this.model.attributes.data.categories.terms[level];
                }
                this.model.attributes.data.categories.terms = c;
            } catch (error) {}
            //language 
            try {
                var c = {};
                for (const lang of Object.keys(
                        this.model.attributes.data.language.terms
                    ).sort()) {
                    c[lang] = this.model.attributes.data.language.terms[lang];
                }
                this.model.attributes.data.language.terms = c;
            } catch (error) {}

            if (this.model.attributes.data != undefined) {
                var template = _.template(tpl);
                self.model.attributes.data.levels.termsEx = [];

                _.each(this.model.attributes.data.levels.terms, function(val, key) {
                    var sData = {};
                    sData.key = key;
                    sData.count = val;
                    var descD = _.findWhere(constDesc, { type: "level", key: key });
                    if (descD) {
                        sData.desc = descD.desc;
                    }
                    self.model.attributes.data.levels.termsEx.push(sData);
                });

                self.model.attributes.data.categories.termsEx = [];
                _.each(this.model.attributes.data.categories.terms, function(val, key) {

                    var sData = {};
                    sData.key = key;
                    sData.count = val;
                    var descD = _.findWhere(constDesc, { type: "category", key: key });
                    if (descD) {
                        sData.desc = descD.desc;
                    }

                    self.model.attributes.data.categories.termsEx.push(sData);
                });

                this.$el.html(template(this.model.attributes));

                var category_template = _.template(tpl2)
                this.$category_el.html(category_template(this.model.attributes));

                var categories = self.get_categories(self.model.attributes);
                self.course_card_model = new CourseCardModel();
                self.course_card_view = new CourseCardView({
                    model: self.course_card_model,
                    categories: categories
                });
                var lngFilter = $("#lngFilter");
                if (lngFilter.find("input:checkbox").length == 0) {
                    if (lngFilter.length > 0) {
                        _.each(this.model.attributes.data.language.terms, function(val, key) {
                            var lang_filter = {
                                "en": "English",
                                "hi": "Hindi",
                                "gu": "Gujarati",
                                "kn": "Kannada",
                                "te": "Telugu",
                                "ta": "Tamil",
                                "mr": "Marathi",
                                "my": "Burmese"
                            }
                            if (lang_filter[key] !== undefined) {
                                var name = lang_filter[key]

                            } else {
                                var name = key

                            }
                            lngFilter.append("<span><input type='checkbox' data-pk='" + key + "'></span><span>" + name + "(" + val + ")</span>");
                        });
                    }

                    var lngThis = this;
                    lngFilter.find("input:checkbox").change(function() {
                        if ($(this).attr("checked")) {
                            _.each($("#lngFilter").find('input:checkbox'), function(obj, index) {
                                $(obj).attr("checked", false);
                            });
                            $(this).attr("checked", true);

                            var langs = [];
                            _.each($("#lngFilter").find(':checked'), function(obj, index) {
                                langs.push($(obj).attr('data-pk'));
                            });
                            var language = langs.join(',');

                            var search_string = $("#discovery-input").val();

                            var course_model = lngThis.course_card_model;
                            var course_view = lngThis.course_card_view;
                            course_view.reset();
                            course_model.all = true;

                            filterOption.language = language;
                            filterOption.search_string = search_string;

                            //set course page_size
                            filterOption.page_size = 100;
                            course_model.fetch_data(filterOption);
                        } else {
                            $(this).attr("checked", false);
                            _.each($("#lngFilter").find(':checked'), function(obj, index) {
                                langs.push($(obj).attr('data-pk'));
                            });
                            var language = langs;

                            // if ($(".display_organization").hasClass('display_organization')) {
                            //     filterOption["categories"] = undefined;
                            // }
                            // if ($(".levels").hasClass('levels')) {
                            //     filterOption["levels"] = undefined;
                            // }

                            var search_string = $("#discovery-input").val();
                            // if (search_string == "") {
                            //     filterOption["search_string"] = undefined;
                            // }
                            var search_levels = $("#levels_id").val();
                            if (search_levels == 0) {
                                filterOption["search_levels"] = undefined;
                            }
                            var search_categories = $("#categories_id").val();
                            if (search_categories == 0) {
                                filterOption["search_categories"] = undefined;
                            }

                            var course_model = lngThis.course_card_model;
                            var course_view = lngThis.course_card_view;


                            filterOption.language = language;
                            filterOption.search_string = search_string;
                            course_view.reset();
                            course_model.fetch_data(filterOption);
                        }
                    });
                }
            }
            return this;
        },
        levels: function(e) {
            if ($("li.levels").hasClass('selected')) {
                $("ul li.levels.selected").removeClass("selected");
                alert("ok")
                this.close_btn(this);
            } else {
                e.preventDefault();
                $(e.currentTarget).parent('ul').find('li').removeClass('selected');
                // $("#levels").find('li').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                var search_string = $("#discovery-input").val();
                var levels = $(e.target).attr('data-pk');

                var course_model = this.course_card_model;
                var course_view = this.course_card_view;
                course_view.reset();
                course_model.all = true;
                filterOption.levels = levels;
                filterOption.search_string = search_string;
                //set course page_size
                filterOption.page_size = 100;
                course_model.fetch_data(filterOption);
            }

        },

        display_organization: function(e) {
            e.preventDefault();
            $(e.currentTarget).parent('ul').find('li').removeClass('selected');
            // $("#display_organization").find('li').removeClass('selected');
            $(e.currentTarget).addClass('selected');

            var search_string = $("#discovery-input").val();
            var display_organization = $(e.target).attr('data-pk');

            var course_model = this.course_card_model;
            var course_view = this.course_card_view;
            course_view.reset();
            course_model.all = true;

            filterOption.categories = display_organization;
            filterOption.search_string = search_string;
            //set course page_size 
            filterOption.page_size = 100;
            course_model.fetch_data(filterOption);
        },

        // lngFilter: function(e) {
        //     e.preventDefault();
        //     $('input:checkbox:not(":checked")', "form").on('click', function() {
        //         $(this).parent().addClass("selected");
        //     });


        //     var search_string = $("#discovery-input").val();
        //     var language = $(e.target).attr('data-pk');

        //     var course_model = this.course_card_model;
        //     var course_view = this.course_card_view;
        //     course_view.reset();
        //     course_model.all = true;

        //     var options = {
        //         "search_string": search_string,
        //         "language": language,
        //     }

        //     var levels = $("#levels").find('.selected').attr('data-pk');
        //     if (levels != undefined) {
        //         options["levels"] = levels;
        //     }


        //     course_model.fetch_data(options);
        // },


        close_btn: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var el = $(e.currentTarget).parent('li');

            $(e.currentTarget).parent('li').removeClass('selected');


            if ($(el).hasClass('display_organization')) {
                filterOption["categories"] = undefined;
            }
            if ($(el).hasClass('levels')) {
                filterOption["levels"] = undefined;
            }


            var search_string = $("#discovery-input").val();

            if (search_string == "") {
                filterOption["search_string"] = undefined;
            }

            var course_model = this.course_card_model;
            var course_view = this.course_card_view;

            course_view.reset();
            course_model.fetch_data(filterOption);
            // if (filterOption["categories"] === undefined && filterOption["levels"] === undefined) {
            //     course_model.all = false;
            //     $("#all-courses").hide();
            //     this.model.fetch_all();
            // } else {
            //     course_view.reset();
            //     course_model.fetch_data(filterOption);
            // }
        }
    });
});