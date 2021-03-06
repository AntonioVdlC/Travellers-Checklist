require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['jquery', 'backbone', 'app/router', 'app/store/websql-store'], function ($, Backbone, Router, Store){

    Store.initialize();

    var router = new Router();

    $('body').on('touchend', '.nav-bar', function (e) {
        e.preventDefault();
        window.history.back();
    });

    Backbone.history.start();
});