define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        datatable = require('datatable'),
        tpl = require('text!tpl/resources.html'),
        resource_info_tpl = require('text!tpl/resource_info.html'),
        modal_dialog = require('app/views/modal_dialog');

    return Backbone.View.extend({

        id: 'resources_div',
        $el: null,
        form_data: null,
        events: {
            "click .page-link": "pagination",
            "click .resource_view": "resource_view",
            "click .resource_download":"resource_download",
            "mouseenter .resource_info_view": "resource_info_view",
        },
        initialize: function() {
            this.$el = $("#" + this.id);
            this.listenTo(this.model,'change', this.render);
            this.model.fetch_all();
            this.right_nav_el = $("#right-nav");
        },

        render: function() {
            $(".resource_parent_div").addClass("full-width");
            $("#right-nav").hide();
            var template = _.template(tpl);
            try{
                this.model.attributes["page"] = this.model.options['page'];
            }catch(e){

            }
            return this.$el.html(template(this.model.attributes));
        },

        pagination: function(e) {;
            var self = this
            var page_url = $(e.currentTarget).attr('data-pk');
            if(page_url != undefined){
                var page_number = null;
                if(Number.isInteger(parseInt(page_url))){
                    page_number = page_url;
                }else{
                    page_number = this.getParameterByName("page", page_url);
                }
                if(page_number == null){
                    page_number = 1;
                }
                
                if(self.model.options == undefined){
                    self.model.options = {
                        "page": page_number,
                    }
                }else{
                    self.model.options['page'] = page_number;
                }

                self.model.fetch_all(self.model.options);
            }

        },
       

        getParameterByName: function(name, url) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        },

        getSelectedResourceData: function(resource_id) {
            var resources = this.model.attributes.results.results;
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                if (resource.id == resource_id) {
                    return resource;
                }
            }
        },
        resource_download:function(e){
            var resource_id = $(e.currentTarget).attr("data-pk");
            var resources = this.model.attributes.results.results;
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                if (resource.id == resource_id) {
                    return resource;
                }
            }
        
            var c_p_data = new Object();
            c_p_data["action"]=18;
            c_p_data["metadata"]=resource.content_partner_name;
            c_p_data["page"]=resource.name;
            var csrftoken = document.cookie.split(";")
            .filter(e => {return e.includes("csrf");})[0].split("=")[1];
            $.ajax({  
                url: '/discourse/saveDataToAnalytics/',  
                type: 'GET',    
                headers:{
                    'X-CSRFToken':csrftoken
                },  
                data: c_p_data,  
                success: function (data) {  
                    console.log(data);  
                },  
                error: function () {  
                    console.log('Error in Operation');  
                }  
            });
        },
        resource_view: function(e){
            var resource_id = $(e.currentTarget).attr("data-pk");
            var resource = this.getSelectedResourceData(resource_id);
            var m = new modal_dialog();
            m.show({"data": resource});

            var c_p_data = new Object();
            c_p_data["action"]=19;
            c_p_data["metadata"]=resource.content_partner_name;
            c_p_data["page"]=resource.name;
            var csrftoken = document.cookie.split(";")
            .filter(e => {return e.includes("csrf");})[0].split("=")[1];
            $.ajax({  
                url: '/discourse/saveDataToAnalytics/',  
                type: 'GET',    
                headers:{
                    'X-CSRFToken':csrftoken
                },  
                data: c_p_data,  
                success: function (data) {  
                    console.log(data);  
                },  
                error: function () {  
                    console.log('Error in Operation');  
                }  
            });
        },

        resource_info_view: function(e){
            $(".resource_parent_div").removeClass("full-width");
            $("#right-nav").show();

            var resource_id = $(e.currentTarget).attr("data-pk");
            var resource = this.getSelectedResourceData(resource_id);
            var template = _.template(resource_info_tpl);
            return this.right_nav_el.html(template({"data":resource}));
        }
        
    });
});