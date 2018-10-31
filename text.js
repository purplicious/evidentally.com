view.Text = (function(Utils){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-text ' + (options.className || '');
        this._transform = options.transform || function(value) {return value;};

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value) {
            Utils.setTextContent(this._wrapper,this._transform(value));
        }

    };

    return exports;

}(utils));