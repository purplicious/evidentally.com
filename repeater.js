view.Repeater = (function(getPresenterByType){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-repeater ' + (options.className || '');

        this._delay = options.delay || 0;
        this._transform = options.transform || function(value){return value;};
        this._destroyed = false;

        this._presenter = options.presenter;
        this._Presenter = getPresenterByType(this._presenter.type);

        this._prepend = typeof options.prepend === 'undefined' ? true : options.prepend;

        this._presenterStorage = [];

    };

    exports.prototype = {

        redraw:function(){
            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].redraw();
            }
        },

        destroy:function() {

            this._destroyed = true;

            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].destroy();
            }

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value) {

            value = this._transform(value);
            value = value instanceof Array ? value : [value];

            if (this._prepend) {
                value.reverse();
            }

            var i=0;
            var l = value.length;
            var presenter;
            var delay = 0;
            var element;
            var crop;
            var swap = value.length !== this._wrapper.children.length;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                if (!presenter) {

                    presenter = new this._Presenter(this._presenter.options || {});

                    if (this._wrapper.children.length === 0 || !this._prepend) {
                        this._wrapper.appendChild(presenter.getElement());
                    }
                    else {
                        this._wrapper.insertBefore(presenter.getElement(),this._wrapper.firstChild);
                    }

                    this._presenterStorage[i] = presenter;

                    if (this._delay) {
                        delay -= this._delay;
                    }

                }

                if (this._delay && !swap) {
                    this._setValueDelayed(presenter,value[i],delay);
                    delay += this._delay;
                }
                else {
                    this._setValue(presenter,value[i],swap);
                }
            }

            l=this._wrapper.children.length;
            crop = i;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                element = presenter.destroy();
                element.parentNode.removeChild(element);

                this._presenterStorage[i] = null;

            }

            this._presenterStorage.length = crop;

        },

        _setValueDelayed:function(presenter,value,delay,swap) {
            var self = this;
            setTimeout(function(){
                self._setValue(presenter,value,swap);
            },delay);
        },

        _setValue:function(presenter,value,swap) {
            if (swap) {
                presenter.setValue(' ');
            }
            presenter.setValue(value);
        }

    };

    return exports;

}(getPresenterByType));