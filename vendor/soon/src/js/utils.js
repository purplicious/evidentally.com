utils = (function(){

	// test if supports textContent
	var hasTextContentSupport = 'textContent' in document.documentElement;

    // iso to date
    // http://stackoverflow.com/questions/11020658/javascript-json-date-parse-in-ie7-ie8-returns-nan
    var dateFromISO = function(s){
        var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
        if(p[1]){
            day= p[1].split(/\D/);
            for(var i= 0, L= day.length; i<L; i++){
                day[i]= parseInt(day[i], 10) || 0;
            }
            day[1]-= 1;
            day= new Date(Date.UTC.apply(Date, day));
            if(!day.getDate()) return Number.NaN;
            if(p[5]){
                tz= (parseInt(p[5], 10)*60);
                if(p[6]) tz+= parseInt(p[6], 10);
                if(p[4]== '+') tz*= -1;
                if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
            }
            return day;
        }
        return Number.NaN;
    };

    var _dt = new Date('2015-01-01T12:00:00.123+01:00');
    var getDate = isNaN(_dt) ? function(iso) {return dateFromISO(iso);} : function(iso){return new Date(iso);};

    // test if this browser supports 3d transforms
    function hasTransformSupport() {
        if (!window.getComputedStyle) {
            return false;
        }

        var el = document.createElement('div'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }

    // test for animation support
    function hasAnimationSupport(){

        var animation = false,
            animationString = 'animation',
            keyframePrefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx  = '',
            i= 0,
            elm = document.body,
            l=domPrefixes.length;

        if (elm.style.animationName !== undefined ) { animation = true; }

        if (animation === false) {
            for(; i < l; i++ ) {
                if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                    pfx = domPrefixes[ i ];
                    animationString = pfx + 'Animation';
                    keyframePrefix = '-' + pfx.toLowerCase() + '-';
                    animation = true;
                    break;
                }
            }
        }
        return animation;

    }

    var documentVisibilityEvent;
    var documentHiddenAttribute;
    if (typeof document.hidden !== 'undefined') {
        documentHiddenAttribute = 'hidden';
        documentVisibilityEvent = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
        documentHiddenAttribute = 'mozHidden';
        documentVisibilityEvent = 'mozvisibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        documentHiddenAttribute = 'msHidden';
        documentVisibilityEvent = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        documentHiddenAttribute = 'webkitHidden';
        documentVisibilityEvent = 'webkitvisibilitychange';
    }


    var animationsSupported = false;
    var textContentSupported = false;

    var millisecond = 1,
        second = 1000 * millisecond,
        minute = 60 * second,
        hour = 60 * minute,
        day = 24 * hour,
        week = 7 * day;

    var exports = {

        MAX:{
            y:100,
            M:12,
            w:52,
            d:365,
            h:24,
            m:60,
            s:60,
            ms:1000
        },

        AMOUNT:{
            //y:year,
            //M:month,
            w:week,
            d:day,
            h:hour,
            m:minute,
            s:second,
            ms:millisecond
        },

		NAMES:{
			y:'years',
			M:'months',
			w:'weeks',
			d:'days',
			h:'hours',
			m:'minutes',
			s:'seconds',
			ms:'milliseconds'
		},

		FORMATS:['y','M','w','d','h','m','s','ms'],

        CIRC:Math.PI * 2,
        QUART:Math.PI * .5,

        DAYS:['su','mo','tu','we','th','fr','sa'],

        setText:null,

        documentVisibilityEvent:documentVisibilityEvent,

        pad:function(value){return ('00' + value).slice(-2)},

        getDayIndex:function(day) {
            return this.DAYS.indexOf(day.substr(0,2));
        },

        isSlow:function() {
            return !hasTextContentSupport;
        },

        supportsAnimation:function() {

            // for animations we need both the animation and the transform API
            animationsSupported = hasAnimationSupport() && hasTransformSupport();

            exports.supportsAnimation = function(){return animationsSupported;};

            return animationsSupported;

        },

        toArray:function(args) {
            return Array.prototype.slice.call(args);
        },

        toBoolean:function(value) {
            if (typeof value === 'string') {
                return value === 'true';
            }
            return value;
        },

        isoToDate:function(iso) {

            // contains timezone?
            if (iso.match(/(Z)|([+\-][0-9]{2}:?[0-9]*$)/g)) {
                return getDate(iso);
            }

            // no timezone and contains time, make local
            iso += iso.indexOf('T') !==-1 ? 'Z' : '';
            var date = getDate(iso);
            return this.dateToLocal(date);
        },

        dateToLocal:function(date) {
            return new Date(
                date.getTime() + (date.getTimezoneOffset() * 60000)
            );
        },

        prefix:(function(){
            var vendors = ['webkit', 'Moz', 'ms', 'O'],i = 0,l = vendors.length,transform,elementStyle = document.createElement('div').style;
            for (;i<l;i++) {
                transform = vendors[i] + 'Transform';
                if (transform in elementStyle ) { return vendors[i]; }
            }
            return null;
        })(),

        setTransform:function(element,value) {
            element.style[this.prefix + 'Transform'] = value;
            element.style['transform'] = value;
        },

        setTransitionDelay:function(element,value) {
            element.style[this.prefix + 'TransitionDelay'] = value + ',' + value + ',' + value;
            element.style['TransitionDelay'] = value + ',' + value + ',' + value;
        },

        getShadowProperties:function(value) {
            value = value ? value.match(/(-?\d+px)|(rgba\(.+\))|(rgb\(.+\))|(#[abcdef\d]+)/g) : null;
            if (!value) {return null;}
            var i=0,l=value.length,c,r=[];
            for(;i<l;i++) {
                if(value[i].indexOf('px')!==-1) {
                    r.push(parseInt(value[i],10));
                }
                else {
                    c = value[i];
                }
            }
            r.push(c);

            if (r.length === 5) {
                r.splice(3,1);
            }

            return r;
        },

        getDevicePixelRatio:function() {
            return window.devicePixelRatio || 1;
        },

        isDocumentHidden:function() {
            return documentHiddenAttribute ? document[documentHiddenAttribute] : false;
        },

        triggerAnimation:function(element,animationClass) {

            element.classList.remove(animationClass);

            window.requestAnimationFrame(function(){

                element.offsetLeft;
                element.classList.add(animationClass);

            });

        },

        getBackingStoreRatio:function(ctx) {
            return ctx.webkitBackingStorePixelRatio ||
                   ctx.mozBackingStorePixelRatio ||
                   ctx.msBackingStorePixelRatio ||
                   ctx.oBackingStorePixelRatio ||
                   ctx.backingStorePixelRatio || 1;
        },

        setShadow:function(ctx,x,y,blur,color) {
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
            ctx.shadowBlur = blur;
            ctx.shadowColor = color;
        },

        getColorBetween:function(from,to,percent) {

            function makeChannel(a, b) {
                return(a + Math.round((b-a)*percent));
            }

            function makeColorPiece(num) {
                num = Math.min(num, 255);   // not more than 255
                num = Math.max(num, 0);     // not less than 0
                var str = num.toString(16);
                if (str.length < 2) {
                    str = '0' + str;
                }
                return(str);
            }

            return('#' +
                makeColorPiece(makeChannel(from.r, to.r)) +
                makeColorPiece(makeChannel(from.g, to.g)) +
                makeColorPiece(makeChannel(from.b, to.b))
            );

        },

        getGradientColors:function(from,to,detail) {

            // calculate in betweens
            var colors = [];
            var i=0,l=detail,s=1/(l-1),p=0;
            for(;i<l;i++) {
                colors[i] = this.getColorBetween(from,to,p);
                p += s;
            }

            return colors;
        },

        hexToRgb:function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        drawGradientArc:function(ctx,x,y,radius,offset,length,from,to,width,colorFrom,colorTo,shadow,cap) {

            if (to < from) {return;}

            // add shadow
            if (shadow) {

                this.drawArc(
                    ctx,
                    x,
                    y,
                    radius,

                    offset,
                    length,
                    from,
                    to,

                    width,
                    'transparent',
                    shadow,

                    cap
                );

            }

            var fromRGB = this.hexToRgb(colorFrom);
            var toRGB = this.hexToRgb(colorTo);

            // get relative to and from color
            var fromRGBRelative = this.hexToRgb(this.getColorBetween(fromRGB,toRGB,(from - offset) / length));
            var toRGBRelative = this.hexToRgb(this.getColorBetween(fromRGB,toRGB,(to - offset) / length));

            // get all colors
            var range = to - from;
            var segmentCount = Math.ceil(range * 30);
            var colors = this.getGradientColors(fromRGBRelative,toRGBRelative,segmentCount);

            // let's do this
            var start = -this.QUART + (this.CIRC * from);
            var gradient;
            var startColor,endColor,xStart,yStart,xEnd,yEnd;
            var l = colors.length;
            var i = 0;
            var segment = (this.CIRC * range) / l;

            for (; i < l; i++) {

                startColor = colors[i];
                endColor = colors[i+1] || startColor;

                // x start / end of the next arc to draw
                xStart = x + Math.cos(start) * radius;
                xEnd = x + Math.cos(start + segment) * radius;

                // y start / end of the next arc to draw
                yStart = y + Math.sin(start) * radius;
                yEnd = y + Math.sin(start + segment) * radius;

                ctx.beginPath();

                gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1.0, endColor);

                ctx.lineCap = cap;
                ctx.strokeStyle = gradient;
                ctx.arc(x, y, radius, start -.005, start + segment + 0.005);
                ctx.lineWidth = width;
                ctx.stroke();
                ctx.closePath();

                start += segment;
            }

        },

        drawArc:function(ctx,x,y,radius,offset,length,from,to,width,color,shadow,cap) {

            if (to < from) {return;}

            if (color.gradient.colors !== null && color.gradient.type === 'follow') {

                this.drawGradientArc(
                    ctx,
                    x,
                    y,
                    radius,

                    offset,
                    length,
                    from,
                    to,

                    width,
                    color.gradient.colors[0],
                    color.gradient.colors[1],
                    shadow,

                    cap
                );

                return;
            }

            if (shadow) {

                var translation = color.fill === 'transparent' ? 9999 : 0;

                ctx.save();

                ctx.translate(translation,0);

                this.setShadow(
                    ctx,
                    shadow[0] - translation,
                    shadow[1],
                    shadow[2],
                    shadow[3]
                );

            }

            ctx.beginPath();
            ctx.lineWidth = width;

            ctx.arc(
            x, y, radius,
            -this.QUART + (this.CIRC * from),
            -this.QUART + (this.CIRC * to)
            , false);


            if (color.gradient.colors) {
                var grad = color.gradient.type === 'horizontal' ?
                    ctx.createLinearGradient(0, radius, radius * 2, radius) :
                    ctx.createLinearGradient(radius, 0, radius, radius * 2);
                grad.addColorStop(0, color.gradient.colors[0]);
                grad.addColorStop(1, color.gradient.colors[1]);
                ctx.strokeStyle = grad;
            }
            else {
                ctx.strokeStyle = color.fill === 'transparent' ? '#000' : color.fill;
            }


            ctx.lineCap = cap;

            ctx.stroke();

            if (shadow) {
                ctx.restore();
            }

        },

        drawRing:function(ctx,

                          progress,

                          offset,
                          length,
                          gap,

                          size,

                          radiusRing,
                          widthRing,
                          colorRing,
                          shadowRing,

                          radiusProgress,
                          widthProgress,
                          colorProgress,
                          shadowProgress,

                          cap,

                          invert
            ) {

            if (length + gap > 1) {
                length = length - (-1 + length + gap);
                offset = offset + (gap * .5);
            }

            var aStart = offset;
            var bEnd = offset + length;
            var mid = progress * length;
            var scale = .5 - Math.abs(-.5 + progress);
            var aEnd = offset + (mid - (scale * gap));
            var bStart = offset + (mid + ((1-scale) * gap));

            // if no radius supplied, quit
            if (!radiusRing && !radiusProgress) {return;}

            // let's draw
            if (invert) {

                this.drawArc(
                    ctx,size,size,radiusRing,
                    offset,length,
                    bStart,bEnd,
                    widthRing,colorRing,shadowRing,
                    cap
                );

                this.drawArc(
                    ctx,size,size,radiusProgress,
                    offset,length,
                    aStart,aEnd,
                    widthProgress,colorProgress,shadowProgress,
                    cap
                );

            }
            else {

                this.drawArc(
                    ctx,size,size,radiusRing,
                    offset,length,
                    aStart,aEnd,
                    widthRing,colorRing,shadowRing,
                    cap
                );

                this.drawArc(
                    ctx,size,size,radiusProgress,
                    offset,length,
                    bStart,bEnd,
                    widthProgress,colorProgress,shadowProgress,
                    cap
                );

            }
        },

        setTextContent:(function() {
            if (hasTextContentSupport) {
                return function(node,text) {
                    node.textContent = text;
                }
            }
            else {
                return function(node,text) {
                    node.innerText = text;
                }
            }
        })()

    };

    return exports;

}());