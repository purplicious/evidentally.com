view.Ring = (function(Utils,Resizer){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-ring ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._modifiers = options.modifiers;

        this._animate = options.animate;
        this._drawn = false;

        this._canvas = document.createElement('canvas');
        this._wrapper.appendChild(this._canvas);

        this._style = document.createElement('span');
        this._style.className = 'soon-ring-progress';
        this._style.style.visibility = 'hidden';
        this._style.style.position = 'absolute';
        this._wrapper.appendChild(this._style);

        this._current = 0;
        this._target = null;
        this._destroyed = false;

        this._lastTick = 0;
        this._styles = null;

        // start ticking
        var self = this;
        if (Utils.supportsAnimation()) {
            window.requestAnimationFrame(function(ts){
                self._tick(ts);
            });
        }
        else {
            this._animate = false;
        }
    };

    exports.prototype = {

        destroy:function() {
            this._destroyed = true;
            Resizer.deregister(this._resizeBind);
            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        _getModifier:function(type) {

            var i= 0,l=this._modifiers.length,hit=null;
            for (;i<l;i++){
                if (this._modifiers[i].indexOf(type)!==-1) {
                    hit = this._modifiers[i];
                    break;
                }
            }

            if (!hit) {
                return null;
            }

            if (hit.indexOf('-')===-1) {
                return true;
            }

            var parts = hit.split('-');
            if (parts[1].indexOf('_')!==-1) {
                // color
                var colors = parts[1].split('_');
                colors[0] = '#' + colors[0];
                colors[1] = '#' + colors[1];
                return colors;
            }

            var fl = parseFloat(parts[1]);
            if (isNaN(fl)) {
                return parts[1];
            }

            // percentage
            return fl / 100;

        },

        redraw:function(){

            var styles = window.getComputedStyle(this._style);

            this._styles = {
                offset:this._getModifier('offset') || 0,
                gap:this._getModifier('gap') || 0,
                length:this._getModifier('length') || 1,
                flip:this._getModifier('flip') || false,
                invert:this._getModifier('invert') || null,
                align:'center',
                size:0,
                radius:0,
                padding:parseInt(styles.getPropertyValue('padding-bottom'),10) || 0,
                cap:parseInt(styles.getPropertyValue('border-top-right-radius'),10) === 0 ? 'butt' : 'round',
                progressColor:{
                    fill:styles.getPropertyValue('color') || '#000',
                    gradient:{
                        colors:this._getModifier('progressgradient') || null,
                        type:this._getModifier('progressgradienttype') || 'follow'
                    }
                },
                progressWidth:parseInt(styles.getPropertyValue('border-top-width'),10) || 2,
                progressShadow:Utils.getShadowProperties(styles.getPropertyValue('text-shadow')),
                ringColor:{
                    fill:styles.getPropertyValue('background-color') || '#fff',
                    gradient:{
                        colors:this._getModifier('ringgradient') || null,
                        type:this._getModifier('ringgradienttype') || 'follow'
                    }
                },
                ringWidth:parseInt(styles.getPropertyValue('border-bottom-width'),10) || 2,
                ringShadow:Utils.getShadowProperties(styles.getPropertyValue('box-shadow'))
            };

            var ctx = this._canvas.getContext('2d'),
                size = this._canvas.parentNode.clientWidth,
                devicePixelRatio = Utils.getDevicePixelRatio(),
                backingStoreRatio = Utils.getBackingStoreRatio(ctx),
                ratio = devicePixelRatio / backingStoreRatio,
                maxWidthFactor = size < 125 ? Math.min(1,size * .005) : 1;

            // cap width depending on window size, will always result in a minimum width of 1
            this._styles.ringWidth = Math.ceil(this._styles.ringWidth * maxWidthFactor);
            this._styles.progressWidth = Math.ceil(this._styles.progressWidth * maxWidthFactor);

            // fix 'transparent' color values

            if (this._styles.ringColor.fill === 'transparent') {
                this._styles.ringColor.fill = 'rgba(0,0,0,0)';
            }

            if (this._styles.progressColor.fill === 'transparent') {
                this._styles.progressColor.fill = 'rgba(0,0,0,0)';
            }


            // set gap style
            if (this._styles.cap === 'round' && this._modifiers.join('').indexOf('gap-') === -1) {
                this._styles.gap = ((this._styles.ringWidth + this._styles.progressWidth) * .5) * .005;
            }

            if (!size) {
                return;
            }

            if (devicePixelRatio !== backingStoreRatio) {

                this._canvas.width = size * ratio;
                this._canvas.height = size * ratio;

                this._canvas.style.width = size + 'px';
                this._canvas.style.height = size + 'px';

                ctx.scale(ratio,ratio);

            }
            else {

                this._canvas.width = size;
                this._canvas.height = size;
            }

            this._styles.size = size * .5;

            // background
            var radius = (this._styles.size - this._styles.padding);
            this._styles.ringRadius = radius - (this._styles.ringWidth * .5);
            this._styles.progressRadius = radius - (this._styles.progressWidth * .5);

            if (this._styles.progressWidth === this._styles.ringWidth) {
                this._styles.progressRadius = this._styles.ringRadius;
            }
            else if (this._styles.progressWidth < this._styles.ringWidth) {
                // progress
                if (this._modifiers.indexOf('align-center')!==-1) {
                    this._styles.progressRadius = this._styles.ringRadius;
                }
                else if (this._modifiers.indexOf('align-bottom')!==-1) {
                    this._styles.progressRadius = radius - (this._styles.ringWidth - (this._styles.progressWidth *.5));
                }
                else if (this._modifiers.indexOf('align-inside')!==-1) {
                    this._styles.progressRadius = radius - (this._styles.ringWidth + (this._styles.progressWidth * .5));
                }
            }
            else {
                // ring
                if (this._modifiers.indexOf('align-center')!==-1) {
                    this._styles.ringRadius = this._styles.progressRadius;
                }
                else if (this._modifiers.indexOf('align-bottom')!==-1) {
                    this._styles.ringRadius = radius - (this._styles.progressWidth - (this._styles.ringWidth * .5));
                }
                else if (this._modifiers.indexOf('align-inside')!==-1) {
                    this._styles.ringRadius = radius - (this._styles.progressWidth + (this._styles.ringWidth * .5));
                }
            }

            if (this._modifiers.indexOf('glow-progress')!==-1 && this._styles.progressShadow) {
                this._styles.progressShadow[this._styles.progressShadow.length-1] =
                    this._styles.progressColor.gradient.colors !== null ? this._styles.progressColor.gradient.colors[0] : this._styles.progressColor.fill;
            }

            if (this._modifiers.indexOf('glow-background')!==-1 && this._styles.ringShadow) {
                this._styles.ringShadow[this._styles.ringShadow.length-1] =
                    this._styles.ringColor.gradient.colors !== null ? this._styles.ringColor.gradient.colors[0]:  this._styles.ringColor.fill;
            }

            this._drawn = false;
        },

        _tick:function(ts) {

            if (this._destroyed) {
                return;
            }

            // needs target to function
            if (this._target !== null) {
                this._draw(ts);
            }

            // to the next frame
            var self = this;
            window.requestAnimationFrame(function(ts){
                self._tick(ts);
            });

        },

        _draw:function(ts){

            if (this._animate) {

                // calculate step
                var diff = ts - this._lastTick;
                var fps = diff < 250 ? 1000/diff : 30;
                this._lastTick = ts;

                // if rendering same value, stop here
                if (this._current === this._target && this._drawn) {
                    return;
                }

                // get distance to animate
                this._current += (this._target - this._current) / (fps / 3);

                // if reached target, cap
                if (Math.abs(this._current - this._target) <= .001) {
                    this._current = this._target;
                }

            }
            else {
                this._current = this._target;
            }

            // clear the current context
            var ctx = this._canvas.getContext('2d');
            ctx.clearRect(0,0,this._canvas.width,this._canvas.height);

            // apply flip
            var p = this._styles.flip ? 1 - this._current : this._current;

            Utils.drawRing(
                ctx,

                p,

                this._styles.offset,
                this._styles.length,
                this._styles.gap,

                this._styles.size,

                this._styles.ringRadius,
                this._styles.ringWidth,
                this._styles.ringColor,
                this._styles.ringShadow,

                this._styles.progressRadius,
                this._styles.progressWidth,
                this._styles.progressColor,
                this._styles.progressShadow,

                this._styles.cap,

                this._styles.invert
            );

            this._drawn = true;
        },

        setValue:function(value){

            if (!this._styles) {
                this.redraw();
            }

            value = this._transform(value);
            if (this._target !== value) {

                if (this._target == null) {
                    this._current = value;
                }

                this._target = value;

            }

            if(!Utils.supportsAnimation()) {
                this._current = this._target;
                this._draw();
            }
        }

    };

    return exports;

}(utils,resizer));