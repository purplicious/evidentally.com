view.Group = (function(getPresenter){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-group ' + (options.className || '');

        this._inner = document.createElement('span');
        this._inner.className = 'soon-group-inner';
        this._wrapper.appendChild(this._inner);

        this._transform = options.transform || function(value){return value;};

        this._presenters = options.presenters;

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

            // set value, if it's 0 we can hide a group if necessary
            this._wrapper.setAttribute('data-value',value);

            // present value
            value = this._transform(value);
            var i=0;
            var isArray = value instanceof Array;
            var l = isArray ? value.length : this._presenters.length;
            var presenter;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                if (!presenter) {
                    presenter = getPresenter(this._presenters[i]);
                    this._inner.appendChild(presenter.getElement());
                    this._presenterStorage[i] = presenter;
                }

                presenter.setValue(isArray ? value[i] : value);

            }

        }

    };

    return exports;

}(getPresenter));