// expose as jQuery plugin
(function(factory,$){

    'use strict';

    // if no jquery, stop here
    if (!$) {return;}

    var methods = [
        'destroy',
        'reset',
        'resize',
        'freeze',
        'unfreeze',
        'redraw'
    ];
    var l=methods.length;

    // setup plugin
    $.fn.soon = function() {

        var context = this;

        context.create = function(options) {
            return this.each(function() {
                factory.create(this,options);
            });
        };

        context.setOption = function(property,value) {
            return this.each(function() {
                factory.setOption(this,property,value);
            });
        };

        context.setOptions = function(options) {
            return this.each(function() {
                factory.setOptions(this,options);
            });
        };

        var i=0;
        for (;i<l;i++) {
            (function(name) {
                context[name] = function() {
                    return this.each(function(){
                        factory[name](this);
                    });
                }
            }(methods[i]));
        }

        return this;

    };


}(exports,jQuery));