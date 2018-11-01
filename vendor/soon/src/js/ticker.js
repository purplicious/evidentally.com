var Ticker = (function(win,Utils,undefined){

    var exports = function(cb,options){

        options = options || {};

        // tick rate
        this._rate = options.rate || 1000;

        // time countdown started
        this._offset = null;

        // time passed
        this._time = 0;

        // has the timer been paused
        this._paused = false;

        // reference to tick timeout
        this._nextTickReference = null;
        this._tickBind = this._tick.bind(this);
        
        // on tick callback
        this._onTick = cb || function(){};

        // listen to visibility changes
        if ('addEventListener' in document) {
            document.addEventListener(Utils.documentVisibilityEvent,this);
        }

    };

    exports.prototype = {

        handleEvent:function(){

            if (Utils.isDocumentHidden()) {
                this._lock();
            }
            else {
                this._unlock();
            }

        },

        isRunning:function() {
            return this._offset !== null;
        },

        isPaused:function() {
            return this.isRunning() && this._paused;
        },

        start:function(){

            // if already running stop here
            if (this.isRunning()) {return;}

            // start time
            this.reset();

        },

        getTime:function(){
            return this._time;
        },

        reset:function() {

            // pause
            this.pause();

            // set new offset and reset time passed
            this._offset = new Date().getTime();
            this._time = 0;

            // resume ticking
            this.resume();

        },

        stop:function(){

            var self = this;
            setTimeout(function(){
                self._clearTimer();
                self._offset = null;
            },0);

        },

        pause:function(){

            this._paused = true;

            this._clearTimer();

        },

        resume:function(){

            // if already ticking
            if (!this.isPaused()) {return;}

            // no longer paused
            this._paused = false;

            // calculate new offset
            var newOffset = new Date().getTime();
            this._time += newOffset - this._offset;
            this._offset = newOffset;

            // resume ticking
            this._tick();

        },

        _clearTimer:function() {

            clearTimeout(this._nextTickReference);
            this._nextTickReference = null;

        },

        _lock:function(){

            this._clearTimer();

        },

        _unlock:function() {

            // if timer was paused, don't start ticking
            if (this.isPaused()) {return;}

            // resume ticking
            this.pause();
            this.resume();

        },

        _tick:function(){

            // tick tack
            this._onTick(this._time);

            // add to offset
            this._offset += this._rate;

            // add to passed time
            this._time += this._rate;

            // remember timeout for later clearing
            //clearTimeout(this._nextTickReference);
            this._nextTickReference = win.setTimeout(
                this._tickBind,
                this._offset - new Date().getTime()
            );

        }

    };

    return exports;

}(this,utils));