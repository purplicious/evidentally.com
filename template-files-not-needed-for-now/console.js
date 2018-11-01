view.Console = (function(){

    var exports = function(options){

        this._transform = options.transform || function(value){return value;};

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function(){
            return null;
        },

        getElement:function(){
            return null;
        },

        setValue:function(value) {
            console.log(this._transform(value));
        }

    };

    return exports;

}());