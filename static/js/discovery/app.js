require.config({

    baseUrl: '/static/firki_theme_new/js/discovery/lib',

    paths: {
        app: '../app',
        tpl: '../templates',
        jquery : 'jquery',
        bootstrap : 'bootstrap.min',
        slick : 'slick',
        cookie : 'jquery.cookie',
    },

    shim: {
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap':{
            dep : [ 'jquery'],
            exports: 'Bootstrap'
        },
        'slick':{
            dep : [ 'jquery'],
            exports: 'Slick'
        },
        'cookie':{
            dep : [ 'jquery'],
            exports: 'Cookie'
        }
    }
});

require(['jquery', 'backbone', 'app/views/search-form', 'app/models/left-nav', 'app/views/left-nav'], function($, Backbone, SearchForm, LeftNavModel, LeftNavForm) {

    var left_nav_model = new LeftNavModel();
    var $left_nav = new LeftNavForm({model:left_nav_model});
    var $search_form = new SearchForm({left_nav:$left_nav});
});