define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/left-nav.html'),
        nav_model = require('app/models/left-nav'),
        ResourceModel = require('app/models/resource'),
        ResourceView = require('app/views/resource');

    return Backbone.View.extend({

        id: 'left-nav',
        $el: null,
        searchParam: {},
        events: {
            "click .content_partner": "content_partner",
            "click .grade": "grade",
            "click .subject": "subject",
            "click .close-btn": "close_btn",
        },
        initialize: function() {
            this.$el = $("#" + this.id);
            var self = this;
            self.model = new nav_model();
            // model fetch
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch_all();
        },

        render: function() {
            var self = this;
            // sort content_partner
            var array_content_partner = this.model.attributes.data.content_partner;
            var array_subject = this.model.attributes.data.subject;
            array_content_partner.sort(compare);
            array_subject.sort(compare);
            // compare fun for sorting content_partener, grade and subject
            function compare(a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }
            //end content_partner
            if (this.model.attributes.data != undefined) {
                self.resource_model = new ResourceModel();
                self.resource_view = new ResourceView({
                    model: self.resource_model,
                });
                var template = _.template(tpl);
                this.$el.html(template(self.model.attributes));
                return this;
            }
        },

        content_partner: function(e) {
            var targetJQ = $(e.target);
            if ($(targetJQ).hasClass('selected')) {
                e.preventDefault();
                // var targetJQ = $(e.target);
                if (e.target.tagName != "SPAN")
                    targetJQ = targetJQ.parents("span:eq(0)");

                targetJQ.removeClass("selected");

                //$("ul li.content_partner.selected").removeClass("selected");
                this.close_btn(e);
            } else {
                e.preventDefault();

                var search_param = $("#resource-input").val();
                // $("#content_partners").find('li').removeClass('selected');
                // var abc = $(e.delegateTarget).find("selected").attr("data-pk");

                $(e.currentTarget).addClass('selected');
                var content_partener_array = [];
                // var content_partner = $(e.target).attr('data-pk');

                var listItems = $("#content_partners span");
                listItems.each(function(id, span) {
                    if ($(span).hasClass("selected")) {
                        var content_list = $(span).attr('data-pk');
                        content_partener_array.push(content_list);
                    }
                });
                var resource_model = this.resource_model;
                var resource_view = this.resource_view;

                this.searchParam.content_partner = content_partener_array.join(",");
                this.searchParam.search_param = search_param;
                this.searchParam.page = 1;
                resource_model.all = true;
                resource_model.fetch_all(this.searchParam);
                var c_p_data = new Object();
                c_p_data["action"] = 16;
                c_p_data["metadata"] = e.target.innerText.slice(0, -4);
                c_p_data["page"] = "Content Partner";
                var csrftoken = document.cookie.split(";")
                    .filter(e => { return e.includes("csrf"); })[0].split("=")[1];
                $.ajax({
                    url: '/discourse/saveDataToAnalytics/',
                    type: 'GET',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: c_p_data,
                    success: function(data, textStatus, xhr) {
                        console.log(data);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Error in Operation');
                    }
                });
            }

        },

        grade: function(e) {
            var targetJQ = $(e.target);
            if ($(targetJQ).hasClass('selected')) {
                e.preventDefault();
                // var targetJQ = $(e.target);
                if (e.target.tagName != "SPAN")
                    targetJQ = targetJQ.parents("span:eq(0)");

                targetJQ.removeClass("selected");
                // $("ul li.grade.selected").removeClass("selected");
                this.close_btn(e);
            } else {
                e.preventDefault();
                var search_param = $("#resource-input").val();
                // $("#grades").find('li').removeClass('selected');
                $(e.currentTarget).addClass('selected');
                // var grade_list = [];
                // var grade = $(e.target).attr('data-pk');
                // grade_list.append(grade);
                var grades_array = [];


                var listItems = $("#grades span");
                listItems.each(function(id, span) {
                    if ($(span).hasClass("selected")) {
                        var grade_list = $(span).attr('data-pk');
                        grades_array.push(grade_list);
                    }
                });
                var resource_model = this.resource_model;
                var resource_view = this.resource_view;
                this.searchParam.grade = grades_array.join(',');
                this.searchParam.search_param = search_param;
                this.searchParam.page = 1;
                resource_model.all = true;

                resource_model.fetch_all(this.searchParam);
                var c_p_data = new Object();
                c_p_data["action"] = 16;
                c_p_data["metadata"] = e.target.innerText.split(" ")[0];
                c_p_data["page"] = "Grade";
                var csrftoken = document.cookie.split(";")
                    .filter(e => { return e.includes("csrf"); })[0].split("=")[1];
                $.ajax({
                    url: '/discourse/saveDataToAnalytics/',
                    type: 'GET',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: c_p_data,
                    success: function(data, textStatus, xhr) {
                        console.log(data);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Error in Operation');
                    }
                });
            }

        },

        subject: function(e) {
            var targetJQ = $(e.target);
            if ($(targetJQ).hasClass('selected')) {
                e.preventDefault();
                // var targetJQ = $(e.target);
                if (e.target.tagName != "SPAN")
                    targetJQ = targetJQ.parents("span:eq(0)");

                targetJQ.removeClass("selected");
                // $("ul li.subject.selected").removeClass("selected");
                this.close_btn(e);
            } else {
                e.preventDefault();
                var search_param = $("#resource-input").val();
                // $("#subjects").find('li').removeClass('selected');
                // $(e.currentTarget).parent('ul').find('li').removeClass('selected');

                $(e.currentTarget).addClass('selected');

                var subject = $(e.target).attr('data-pk');

                var subjects_array = [];

                var listItems = $("#subjects span");
                listItems.each(function(id, span) {
                    if ($(span).hasClass("selected")) {
                        var subject_list = $(span).attr('data-pk');
                        subjects_array.push(subject_list);
                    }
                });

                var resource_model = this.resource_model;
                var resource_view = this.resource_view;
                // resource_model.reset();
                this.searchParam.subject = subjects_array.join(',');
                this.searchParam.search_param = search_param;
                this.searchParam.page = 1;

                resource_model.all = true;
                resource_model.fetch_all(this.searchParam);

                var c_p_data = new Object();
                c_p_data["action"] = 16;
                c_p_data["metadata"] = e.target.innerText.split(" ")[0];
                c_p_data["page"] = "Subject";
                var csrftoken = document.cookie.split(";")
                    .filter(e => { return e.includes("csrf"); })[0].split("=")[1];
                $.ajax({
                    url: '/discourse/saveDataToAnalytics/',
                    type: 'GET',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    data: c_p_data,
                    success: function(data, textStatus, xhr) {
                        console.log(data);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.log('Error in Operation');
                    }
                });
            }
        },

        close_btn: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var el = $(e.currentTarget).parent('span');
            $(e.currentTarget).parent('span').removeClass('selected');

            var searchParam = {}
            if ($("#content_partners").find('span').hasClass('selected')) {
                searchParam["content_partner"] = $("#content_partners").find('.selected').attr('data-pk');
            }
            if ($("#grades").find('span').hasClass('selected')) {
                searchParam["grade"] = $("#grades").find('.selected').attr('data-pk');
            }
            if ($('#subjects').find('span').hasClass('selected')) {
                searchParam["subject"] = $("#subjects").find('.selected').attr('data-pk');
            }
            var search_string = $("#resource-input").val();

            if (search_string == "") {
                searchParam["search_string"] = undefined;
            }

            var resource_model = this.resource_model;
            var resource_view = this.resource_view;
            if (searchParam["content_partner"] === undefined && searchParam["grade"] === undefined && searchParam["subject"] === undefined) {
                resource_model.all = false;
                $("#resources_data").hide();
                resource_model.fetch_all(searchParam);
                // this.model.fetch_all();
            } else {
                resource_model.fetch_all(searchParam);
            }
        }

    });
});