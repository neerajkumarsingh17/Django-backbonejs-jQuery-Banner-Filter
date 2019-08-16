define(function(require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!tpl/resource_info_modal.html'),
        bootstrap = require('bootstrap'),
        template = _.template(tpl);

     var data_link= {};

    return Backbone.View.extend({

        id: 'base-modal',
        $el: null,
        className: 'modal fade',

        events: {
            "click .close-btn": "close",
            "click .social_link":"social_link",
        },

        initialize: function() {
            // this.$el = $("#" + this.id); 
            _.bindAll(this, 'show', 'render', 'renderView');
            bootstrap; 
        },
     
        show: function(resource) {
            $("#base-modal").remove();
            this.$el.modal('show');
            this.render(resource);
        },

        render: function(resource) {
            data_link=resource
            return this.$el.html(template(resource))
        },
        social_link:function(e){
            var link_dta = data_link.data
            var c_p_data = new Object();
            c_p_data["action"]=17;
            c_p_data["metadata"]=link_dta.name;
            c_p_data["page"]=link_dta.content_partner_name;
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

        renderView: function(template) {
            this.$el.html(template());
        },

        close: function() {
            this.$el.remove();
            $('.modal-backdrop').hide();
        },
    });
});