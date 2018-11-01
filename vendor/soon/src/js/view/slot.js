view.Slot = (function(Utils){

    var exports = function(options) {

        this._forceReplace = typeof options.forceReplace === 'undefined' ? false : options.forceReplace;

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-slot ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._new = document.createElement('span');
        this._new.className = 'soon-slot-new';
        this._old = document.createElement('span');
        this._old.className = 'soon-slot-old';

        this._bounding = document.createElement('span');
        this._bounding.className = 'soon-slot-bounding';

        this._inner = document.createElement('span');
        this._inner.className = 'soon-slot-inner soon-slot-animate';

        this._inner.appendChild(this._old);
        this._inner.appendChild(this._new);
        this._inner.appendChild(this._bounding);

        this._wrapper.appendChild(this._inner);

        this._newValue = '';
        this._oldValue = '';
        this._boundingLength = 0;

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function() {
            return this._wrapper;
        },

        _isEmpty:function() {
            return !this._newValue;
        },

        _isSame:function(value) {
            return this._newValue === value;
        },

        _setBoundingForValue:function(value){

            // if value has a different length than before, change bounding box
            var l = (value + '').length;
            if (l === this._boundingLength) {
                return;
            }

            // set new bounding length
            this._boundingLength = l;

            // build character string
            var str = '',i=0;
            for (;i<l;i++) {
                str+='8';
            }

            // setup spacer
            this._bounding.textContent = str;

            // update slot width, we do this to create a layout boundary so page reflows cost less cpu
            var size = parseInt(getComputedStyle(this._wrapper).fontSize,10);
            var factor = this._bounding.offsetWidth / size;

            // per character we add .1 to fix any font problems, then we apply the width
            this._inner.style.width = (factor + ((l-1) * .1)) + 'em';

        },

        _setNewValue:function(value) {
            this._newValue = value;
            if (value !== ' ') {
                this._new.textContent = value;
            }
        },

        _setOldValue:function(value) {
            this._oldValue = value;
            this._old.textContent = value;
        },

        setValue:function(value) {

            // start with old value

            // new value animates in view

            // old value animates out of view

            // transform
            value = this._transform(value);

            // if is currently empty
            if (this._isEmpty()) {
                this._setNewValue(value);
                this._setBoundingForValue(value);

                // animate first character
                Utils.triggerAnimation(this._inner,'soon-slot-animate');
            }

            // if same value, don't do a thing, unless we're forced to replace
            else if (this._isSame(value) && !this._forceReplace) {
                 // do nothing, literally
            }

            // new value
            else {

                if (this._newValue.length) {
                    this._setOldValue(this._newValue);
                }

                this._setNewValue(value);

                this._setBoundingForValue(value);

                Utils.triggerAnimation(this._inner,'soon-slot-animate');

            }

        }

    };

    return exports;

}(utils));