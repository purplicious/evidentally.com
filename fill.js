view.Fill = (function(Utils){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-fill ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};
        this._direction = 'to-top';

        var i=0,l=options.modifiers.length;
        for(;i<l;i++) {
            if (options.modifiers[i].indexOf('to-')===0) {
                this._direction = options.modifiers[i];
                break;
            }
        }

        this._fill = document.createElement('span');
        this._fill.className = 'soon-fill-inner';

        this._progress = document.createElement('span');
        this._progress.className = 'soon-fill-progress';
        this._fill.appendChild(this._progress);

        this._wrapper.appendChild(this._fill);

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

        setValue:function(value){

            var t = this._transform(value);
            var tr;

            switch(this._direction) {
                case 'to-top':
                    tr = 'translateY(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-top-right':
                    tr = 'scale(1.45) rotateZ(-45deg) translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-top-left':
                    tr = 'scale(1.45) rotateZ(45deg) translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-left':
                    tr = 'translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-right':
                    tr = 'translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-bottom-right':
                    tr = 'scale(1.45) rotateZ(45deg) translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-bottom-left':
                    tr = 'scale(1.45) rotateZ(-45deg) translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-bottom':
                    tr = 'translateY(' + (-100 + (t * 100)) + '%)';
                    break;
                default:
                    break;
            }

            Utils.setTransform(this._progress,tr);

        }
    };

    return exports;

}(utils));