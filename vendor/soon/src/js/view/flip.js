view.Flip = (function (Utils) {

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-flip ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._inner = document.createElement('span');
        this._inner.className = 'soon-flip-inner';

        this._card = document.createElement('span');
        this._card.className = 'soon-flip-card';

        if (Utils.supportsAnimation()) {

            this._front = document.createElement('span');
            this._front.className = 'soon-flip-front soon-flip-face';
            this._back = document.createElement('span');
            this._back.className = 'soon-flip-back soon-flip-face';

            this._card.appendChild(this._front);
            this._card.appendChild(this._back);

            this._top = document.createElement('span');
            this._top.className = 'soon-flip-top soon-flip-face';
            this._card.appendChild(this._top);

            this._bottom = document.createElement('span');
            this._bottom.className = 'soon-flip-bottom soon-flip-face';
            this._card.appendChild(this._bottom);

        }
        else {
            this._fallback = document.createElement('span');
            this._fallback.className = 'soon-flip-fallback';
            this._card.appendChild(this._fallback);
        }

        this._bounding = document.createElement('span');
        this._bounding.className = 'soon-flip-bounding';
        this._card.appendChild(this._bounding);

        this._inner.appendChild(this._card);

        this._wrapper.appendChild(this._inner);

        this._frontValue = null;
        this._backValue = null;
        this._boundingLength = 0;

    };

    exports.prototype = {

        redraw:function(){},

        _setBoundingForValue:function(value) {

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

            // update flipper width, we do this to create a layout boundary so page reflows cost less cpu
            var size = parseInt(getComputedStyle(this._card).fontSize,10);
            var factor = this._bounding.offsetWidth / size;

            // per character we add .1 to fix any font problems, then we apply the width
            this._inner.style.width = (factor + ((l-1) * .1)) + 'em';


        },

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function() {
            return this._wrapper;
        },

        setValue:function(value) {

            value = this._transform(value);

            // if no animation support stop here
            if (!Utils.supportsAnimation()) {
                this._fallback.textContent = value;
                this._setBoundingForValue(value);
                return;
            }

            // check if is currently empty, if so, don't animate but only do setup
            if (!this._frontValue) {
                this._bottom.textContent = value;
                this._front.textContent = value;
                this._frontValue = value;
                this._setBoundingForValue(value);
                return;
            }

            // if is same value as previously stop here
            if (this._backValue && this._backValue === value || this._frontValue === value) {
                return;
            }

            // check if already has value, if so, move value to other panel
            if (this._backValue) {
                this._bottom.textContent = this._backValue;
                this._front.textContent = this._backValue;
                this._frontValue = this._backValue;
            }

            // set values
            this._setBoundingForValue(value);
            this._top.textContent = value;
            this._back.textContent = value;
            this._backValue = value;

            // trigger
            Utils.triggerAnimation(this._inner,'soon-flip-animate');

        }

    };

    return exports;

}(utils));