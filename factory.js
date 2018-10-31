
// private API
var completeCallbacks = [];

var uid = 0;
var size = 0;
var respondTimer = null;
var scales = ['xxl','xl','l','m','s','xs','xxs'];
var scaleDefault = 3; // m
var scaleCount = scales.length;
var soons = [];
var tickerCallbacks = [];
var defaultKeys = {
    'y':{
        'labels':'Year,Years',
        'option':'Years',
        'padding':''
    },
    'M':{
        'labels':'Month,Months',
        'option':'Months',
        'padding':'00'
    },
    'w':{
        'labels':'Week,Weeks',
        'option':'Weeks',
        'padding':'00'
    },
    'd':{
        'labels':'Day,Days',
        'option':'Days',
        'padding':'000'
    },
    'h':{
        'labels':'Hour,Hours',
        'option':'Hours',
        'padding':'00'
    },
    'm':{
        'labels':'Minute,Minutes',
        'option':'Minutes',
        'padding':'00'
    },
    's':{
        'labels':'Second,Seconds',
        'option':'Seconds',
        'padding':'00'
    },
    'ms':{
        'labels':'Millisecond,Milliseconds',
        'option':'Milliseconds',
        'padding':'000'
    }
};

// register respond methods
resizer.register(respond);

// responsive behaviour
function respond() {

    // don't do anything if width has not changed
    if (size === window.innerWidth) {
        return;
    }

    // store new width
    size = window.innerWidth;

    // resize tickers now
    resizeTickers();

}

function fitTicker(node,inner,presenter,available) {

    var root = parseInt(getComputedStyle(document.documentElement).fontSize,10) / 16;
    var currentSize = parseInt(getComputedStyle(inner).fontSize,10) / 16 / root;
    var factor = available / inner.scrollWidth;
    var size = factor * currentSize;

    if (size < 4) {
        node.style.fontSize = '';
        presenter.redraw();
        return false;
    }

    node.style.fontSize = size + 'rem';
    node.setAttribute('data-scale-rounded',Math.round(size).toString());
    presenter.redraw();

    return true;

}

function resizeTicker(node,presenter) {

    // if is slow browser don't do anything
    if (utils.isSlow()){return;}

    // get available space
    var style = window.getComputedStyle(node.parentNode);
    var padLeft = parseInt(style.getPropertyValue('padding-left'),10);
    var padRight = parseInt(style.getPropertyValue('padding-right'),10);
    var available = node.parentNode.clientWidth - padLeft - padRight;

    // get scale settings for this counter
    var max = node.getAttribute('data-scale-max');
    var hide = node.getAttribute('data-scale-hide');
    var scale = max ? scales.indexOf(max) : scaleDefault;

    // setup parameters for scaling
    var groups = node.querySelectorAll('.soon-group-sub');
    var i=0;
    var l=groups.length;
    var inner = node.querySelector('.soon-group');
    var newScale;
    var didHide;

    // show all groups
    for(;i<l;i++) {
        groups[i].style.display = '';
    }

    // if should attempt to fit
    if (max === 'fit' || max === 'fill') {
        if (fitTicker(node,inner,presenter,available)) {
            return; // it fit's we're done
        }
        else {
            scale = 0; // it does not fit, let's scale down
        }
    }

    // while it does not fit pick a smaller scale
    newScale = scale;
    do {
        node.setAttribute('data-scale',scales[newScale]);
        newScale++;
    }
    while (inner.scrollWidth > available && scales[newScale]);
    if (newScale !== scale) {
        presenter.redraw();
    }

    // if fits or no hiding is allowed stop here, stop here
    if (inner.scrollWidth <= available || hide === 'none') {
        return;
    }

    // get groups containing zero values
    i=0;
    didHide=false;
    do {

        // if not empty, move to hiding groups from the right side
        if (groups[i].getAttribute('data-value') !== '0') {
            break;
        }

        // hide the group and recalculate space
        groups[i].style.display = 'none';
        didHide = true;
        i++

    }
    while(inner.scrollWidth > available && i<l);
    if (didHide) {
        presenter.redraw();
    }

    // if only hiding empty values is allowed, let's stop here
    if (hide === 'empty') {
        return;
    }

    // hide from right side
    i=l-1;
    didHide = false;
    do {

        // hide the group and recalculate space
        groups[i].style.display = 'none';
        didHide = true;
        i--;

    }
    while(inner.scrollWidth > available && i > 0);
    if (didHide) {
        presenter.redraw();
    }

}

function resizeTickers() {
    var i=soons.length- 1;
    for(;i>=0;i--) {
        resizeTicker(soons[i].node,soons[i].presenter);
    }
}

function getSoonIndexByElement(element) {
    var i=0;
    var l=soons.length;
    for(;i<l;i++) {
        if (soons[i].node === element) {
            return i;
        }
    }
    return null;
}

function getTickerCallbackIndexByElement(element){
    var i=0;
    var l=tickerCallbacks.length;
    for(;i<l;i++) {
        if (tickerCallbacks[i].node === element) {
            return i;
        }
    }
    return null;
}

function getSoon(element) {
    var index = getSoonIndexByElement(element);
    if (index===null) {
        return null;
    }
    return soons[index];
}

function setDefaultsForSoonElement(element) {

    // add soon class
    if (element.className.indexOf('soon') === -1) {
        element.className += ' soon';
    }

    // add no animation class
    if (!utils.supportsAnimation()) {
        element.className += ' soon-no-animation';
    }

    // set default attributes
    var attr = element.getAttribute('data-layout');
    if (!attr || attr.indexOf('group') === -1 && attr.indexOf('line') === -1) {
        if (!attr) {attr = '';}
        element.setAttribute('data-layout',attr + ' group');
    }

    // if is a slow browser, revert to text
    if (utils.isSlow()) {
        element.removeAttribute('data-visual');
        element.setAttribute('data-view','text');
        element.className += ' soon-slow-browser';
    }

}

function setDataAttribute(element,options,option) {
    if (options[option] && !element.getAttribute('data-' + option)) {
        element.setAttribute('data-' + option,options[option]);
    }
}

function getDataAttribute(element,option) {
    return element.getAttribute('data-' + option);
}

function createClockTransform(options,onComplete) {

    var isCountdown = options.due !== null || options.since !== null;
    var clockTransform = null;

    if (isCountdown) {

        if (options.since) {

            var now = options.now ? options.now.valueOf() : new Date().valueOf();

            // when counting up
            clockTransform = transform.chain(

                function(value){return options.now ? -value : value;},

                transform.offset(now),
                transform.diff(options.since.valueOf()),

                function(value){return Math.abs(value);},
                function(value){return Math.max(0,value);},

                function(value){options.callback.onTick(value,options.since);return value;},

                transform.event(function(value){return value===0;},onComplete),

                transform.duration(new Date(now),options.since,options.format,options.cascade)

            );

        }
        else {

            // when counting down
            clockTransform = transform.chain(

                transform.offset(options.now.valueOf()),

				transform.diff(options.due.valueOf()),

                function(value){return Math.max(0,value);},

                function(value){options.callback.onTick(value,options.due);return value;},

                transform.event(function(value){return value<=0;},onComplete),

                transform.duration(options.now,options.due,options.format,options.cascade)

            );

        }

    }
    else {
        clockTransform = function(){
            var d = new Date();
            return [
                d.getHours(),
                d.getMinutes(),
                d.getSeconds()
            ]
        };
        options.format = ['h','m','s'];
        options.separator = ':';
    }

    return clockTransform;

}

function createClockOutline(options,onComplete) {

    var isCountdown = options.due !== null || options.since !== null;

    var clockTransform = createClockTransform(options,onComplete);
    var clock = {
        type:'group',
        options:{
            transform:clockTransform,
            presenters:[]
        }
    };

    var presenters = [];
    var l = options.format.length;
    var i= 0;
    var group;
    var text;
    var view;
    var reflectedView;
    var wrapper;
    var format;
    var index;

    for(;i<l;i++) {

        format = options.format[i];
        index = i;

        group = {
            type:'group',
            options:{
                className:'soon-group-sub',
                presenters:[]
            }
        };

        if (options.visual) {

            group.options.presenters.push(createVisualizer(options,format));

            if (options.reflect) {
                group.options.presenters.push(createVisualizer(options,format,'soon-reflection'));
            }

        }

        text = {
            type:'text',
            options:{
                className:'soon-label'
            }
        };

        if (options.singular) {
            text.options.transform = transform.plural(options.label[format],options.label[format + '_s']);
        }
        else {
            text.options.transform = (function(format){ return function(){return options.label[format + '_s'];}}(format));
        }

        // if format is ms
        view = createView(options,format);
        reflectedView = null;

        if (options.reflect && !options.visual) {
            reflectedView = createView(options,format,'soon-reflection');
        }

        // create view object
        group.options.presenters.push(view);

        // create reflected view
        if (reflectedView) {
            group.options.presenters.push(reflectedView);
        }

        // only set labels if this is a countdown
        if (isCountdown) {
            group.options.presenters.push(text);
        }


        // if separator set
        if (options.separator) {

            wrapper = {
                type:'group',
                options:{
                    className:'soon-group-separator',
                    presenters:[
                        group
                    ]
                }
            };

            if (index !== 0) {

                if (options.reflect) {
                    wrapper.options.presenters.unshift(
                        {
                            type: 'text',
                            options: {
                                className: 'soon-separator soon-reflection',
                                transform: function () {
                                    return options.separator;
                                }
                            }
                        }
                    );
                }

                wrapper.options.presenters.unshift(
                    {
                        type: 'text',
                        options: {
                            className: 'soon-separator',
                            transform: function () {
                                return options.separator;
                            }
                        }
                    }
                );


            }

            group = wrapper;
        }

        presenters.push(group);
    }

    clock.options.presenters = presenters;

    return clock;

}

function createVisualizer(options,format,className) {

    // handle which visual to show
    var config = options.visual.split(' ');
    var visual = config[0];
    config.shift();

    // setup
    return {
        type:visual,
        options:{
            className:'soon-visual ' + (className || ''),
            transform:transform.chain(
                transform.progress(utils.MAX[format]),
                transform.cap()
            ),
            modifiers:config,
            animate:format !== 'ms'
        }
    }
}

function createView(options,format,className) {

    if (options.chars) {
        return {
            type:'repeater',
            options:{
                delay:options.view === 'text' ? 0 : 50,
                className:'soon-value ' + (className || ''),
                transform:transform.chain(
                    transform.pad(options.padding[format]),
                    transform.chars()
                ),
                presenter: {
                    type:options.view
                }
            }
        };
    }

    return {
        type:'group',
        options:{
            className:'soon-group-sub-sub soon-value ' + (className || ''),
            transform:transform.pad(options.padding[format]),
            presenters:[
                {
                    type:options.view
                }
            ]
        }
    };

}

function register(element,ticker,presenter,options) {

    soons.push({
        node:element,
        ticker:ticker,
        presenter:presenter,
        options:options
    });

}

function getPresenter(options) {
    return new (getPresenterByType(options.type))(options.options || {});
}

function getPresenterByType(type) {
    return view[type.charAt(0).toUpperCase() + type.slice(1)];
}

function createPresenter(element,presenter) {

    // check if should create on inner element
    var ph = element.getElementsByClassName ? element.getElementsByClassName('soon-placeholder') : element.querySelectorAll('soon-placeholder');
    if (ph.length) {
        ph[0].innerHTML = '';
        element = ph[0];
    }

    // else turn the entire element into a presenter
    var presenterInstance = getPresenter(presenter);
    element.appendChild(presenterInstance.getElement());
    return presenterInstance;
}

function createTicker(element,presenter,rate,options) {

    // create ticker instance
    var ticker = new Ticker(
        function(runTime) {
            presenter.setValue(runTime);
        },
        {
            rate:rate
        }
    );

    // remember this ticker for reset, resize and destroy
    register(element,ticker,presenter,options);

    // start ticker
    ticker.start();

    // resize element after first tick
    resizeTicker(element,presenter);

    // return
    return ticker;

}

function createByElement(element) {

    // set single options
    var defaults;
    var types = ['labels','padding'];
    var i,l=2; // 2 == types length
    var options = {
        since:getDataAttribute(element,'since'),
        due:getDataAttribute(element,'due'),
        now:getDataAttribute(element,'now'),
        face:getDataAttribute(element,'face'),
        visual:getDataAttribute(element,'visual'),
        format:getDataAttribute(element,'format'),
        singular:getDataAttribute(element,'singular') === 'true',
        reflect:getDataAttribute(element,'reflect') === 'true',
        scaleMax:getDataAttribute(element,'scale-max'),
        scaleHide:getDataAttribute(element,'scale-hide'),
        separateChars:(!(getDataAttribute(element,'separate-chars') === 'false')),
        cascade:(!(getDataAttribute(element,'cascade') === 'false')),
        separator:getDataAttribute(element,'separator'),
        padding:(!(getDataAttribute(element,'padding') === 'false')),
        eventComplete:getDataAttribute(element,'event-complete'),
        eventTick:getDataAttribute(element,'event-tick')
    };

    // get group options for labels
    for (var key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];
        for(i=0;i<l;i++) {
            options[types[i] + defaults.option] = getDataAttribute(element,types[i] + '-' + defaults.option.toLowerCase());
        }
    }

    return exports.create(element,options);
}

var inRegExp = /([\d]+)[\s]+([a-z]+)/i;
var atRegExp = /([\d]+)[:]*([\d]{2})*[:]*([\d]{2})*/;

function getDueDate(due) {

    var date;

    if (due.indexOf('in ') === 0) {

        // in 1 hour
        // in 3 hours
        // in 1 minute
        // in 60 minutes
        // in 1 second
        // in 5 seconds

        var duration = due.match(inRegExp);
        var c = parseInt(duration[1],10);
        var q = duration[2];

        // set date
        date = new Date();
        if (q.indexOf('hour')!==-1) {
            date.setHours(date.getHours() + c);
        }
        else if (q.indexOf('minute')!==-1) {
            date.setMinutes(date.getMinutes() + c);
        }
        else if (q.indexOf('second') !== -1) {
            date.setSeconds(date.getSeconds() + c);
        }

        return date;

    }
    else if (due.indexOf('at ')!==-1) {

        // at 12
        // at 9
        // monday at 10:30
        // at 15:10:20
        // sunday at 10 zone +01:00
        // reset at 12:30

        date = new Date();
        var now = date.getTime();
        var reset = due.indexOf('reset')!==-1;
        due = due.replace('reset ','');
        var parts = due.split('at ');
        var dueTime = parts[1].match(atRegExp);
        var h = parseInt(dueTime[1],10);
        var m = dueTime[2] ? parseInt(dueTime[2],10) : 0;
        var s = dueTime[3] ? parseInt(dueTime[3],10) : 0;

        // get zone
        var zone = parts[1].split(' zone ');
        if (zone) {
            zone = zone[1];
        }

        // set day of week
        if (parts[0].length) {
            var dayIndex = utils.getDayIndex(parts[0]);
            var distance = (dayIndex + 7 - date.getDay()) % 7;
            date.setDate(date.getDate() + distance);
        }

        // set time
        date.setHours(h);
        date.setMinutes(m);
        date.setSeconds(s);
        date.setMilliseconds(0);

        // test if date has just passed, if so, jump day or week depending on setting
        if (reset && now >= date.getTime()) {
            date.setHours(h + (parts[0].length ? 7*24 : 24));
        }

        // create iso
        var p = utils.pad;
        var isoDate = date.getFullYear() + '-' + p(date.getMonth()+1) + '-' + p(date.getDate());
        var isoTime = p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
        due = isoDate + 'T' + isoTime + (zone || '');
    }

    return utils.isoToDate(due);
}

function getPaddingForFormat(key,format) {

    // if is first, no padding
    if (format.indexOf(key) === 0) {
        return '';
    }

    // if weeks
    if (key === 'w') {

        // when months set, maximum value for weeks is 4
        if (format.indexOf('M')!==-1) {
            return '';
        }

    }

    // if days
    if (key === 'd') {

        // when weeks set, days have no padding
        if (format.indexOf('w')!==-1) {
            return '';
        }

        if (format.indexOf('M')!==-1) {
            return '00';
        }

    }

    return null;

}

function createLoopFunction(element,options,cb) {

    // already created loop function for this counter
    if (cb && completeCallbacks.indexOf(element)!==-1) {
        return cb;
    }

    // generate unique complete callback function
    var loop = (function (complete) {
        return function () {
            complete();

            // recreate counter
            exports.destroy(element);
            exports.create(element, options);

        };

    }(cb));


    // remember
    completeCallbacks.push(element);

    // loop is returned
    return loop;

}

/**
 * Public API
 */
exports.parse = function(element) {
    createByElement(element);
};

exports.redraw = function(element) {
    if (element) {
        var soon = getSoon(element);
        resizeTicker(soon.node,soon.presenter);
    }
    else {
        resizeTickers();
    }
};

exports.reset = function(element) {
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.reset();
    }
};

exports.freeze = function(element) {

    // hold current time
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.pause();
    }

};

exports.unfreeze = function(element) {

    // continue counter, will make time jump
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.resume();
    }

};

exports.setOption = function(element,prop,value) {

    var soon = getSoon(element);
    if (!soon) {
        return;
    }

    var options = soon.options;
    options[prop] = value;

    this.destroy(element);

    this.create(element,options);

};

exports.setOptions = function(element,options) {

    var soon = getSoon(element);
    if (!soon) {
        return;
    }

    var prop;
    var merged = soon.options;
    for (prop in options) {
        if (!options.hasOwnProperty(prop)){continue;}
        merged[prop] = options[prop];
    }

    this.destroy(element);

    this.create(element,options);

};

exports.destroy = function(element) {

    var index = getSoonIndexByElement(element);
    if (index === null) {return;}

    var tickerIndex = getTickerCallbackIndexByElement(element);
    if (tickerIndex !== null) {
        tickerCallbacks.splice(tickerIndex,1);
    }

    var soon = soons[index];

    // if a ticker is attached, stop it before killing the presenter
    if (soon.ticker) {
        soon.ticker.stop();
    }

    // remove presenter
    soon.presenter.destroy();

    // remove the node
    var placeholder = soon.node.querySelector('.soon-placeholder');
    if (placeholder) {
        soon.node.removeChild(placeholder);
    }
    else {
        soon.node.removeChild(soon.node.querySelector('.soon-group'));
    }

    // set initialized to false
    element.removeAttribute('data-initialized');

    // remove the soon object from the collection
    soons.splice(index,1);
};

exports.create = function(element,options) {

    // if no options call on element
    if (!options) {
        return createByElement(element);
    }

    // test if not already initialized
    if (element.getAttribute('data-initialized')==='true') {
        return null;
    }

    // now initialized
    element.setAttribute('data-initialized','true');

    // get callbacks
    var cbComplete = null;
    var cbTick = null;

    if (options.eventComplete) {
        cbComplete = typeof options.eventComplete === 'string' ? window[options.eventComplete] : options.eventComplete;
    }
    if (options.eventTick) {
        cbTick = typeof options.eventTick === 'string' ? window[options.eventTick] : options.eventTick;
    }

    // test if should loop / can be looped
    if (options.due && options.due.indexOf('reset')!==-1) {

        cbComplete = createLoopFunction(element,options,cbComplete);
        options.eventComplete = cbComplete;

    }

    // apply the layout options to the element
    setDataAttribute(element,options,'layout');
    setDataAttribute(element,options,'face');
    setDataAttribute(element,options,'visual');
    setDataAttribute(element,options,'format');

    // set scale
    if (options.scaleMax) {
        element.setAttribute('data-scale-max',options.scaleMax);
    }

    // set hide option
    if (options.scaleHide) {
        element.setAttribute('data-scale-hide',options.scaleHide);
    }

    // get format
    var format = (options.format || 'd,h,m,s').split(',');

    // define ticker rate
    var rate = format.indexOf('ms') === -1 ? 1000 : 24;

    // get labels
    var key;
    var labels = {};
    var defaults;
    var labelParts;
    for (key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];
        labelParts = (options['labels' + defaults.option] || defaults.labels).split(',');
        labels[key] = labelParts[0];
        labels[key + '_s'] = labelParts[1] || labelParts[0];
    }

    // get padding
    var hasPadding = typeof options.padding === 'undefined' ? true : options.padding;
    var padding = {};
    for (key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];

        // padding disabled
        if (!hasPadding) {
            padding[key] = '';
            continue;
        }

        // padding enabled, if left most value, remove padding, else, default padding
        padding[key] = getPaddingForFormat(key,format);
        if (padding[key]===null) {
            padding[key] = defaults.padding;
        }

        // override with padding options if set
        if (options['padding' + defaults.option]) {

            padding[key] = options['padding' + defaults.option]
        }

    }

    // get value
    var view = (options.face || 'text ').split(' ')[0];

    // set due date object
    var due = options.due ? getDueDate(options.due) : null;
    var since = options.since ? utils.isoToDate(options.since) : null;
    var now = options.now ? utils.isoToDate(options.now) : since ? null : new Date();

    // create the presenter
    var setup = {
        due:due,
        since:since,
        now:now,
        view:view,
        visual:options.visual || null,
        format:format,
        separator:options.separator || null,
        cascade:typeof options.cascade === 'undefined' ? true : utils.toBoolean(options.cascade),
        singular:options.singular,
        reflect:options.reflect || false,
        chars:typeof options.separateChars === 'undefined' ? true : utils.toBoolean(options.separateChars),
        label:labels,
        padding:padding,
        callback:{
            onComplete:cbComplete || function(){},
            onTick:cbTick || function(){}
        }
    };

    // if is a slow browser, force text
    if (utils.isSlow()) {
        setup.view = 'text';
        setup.reflect = false;
        setup.visual = null;
    }

    // holds ticker later on
    var ticker = null;

    // create the clock outline
    var outline = createClockOutline(setup,function(){

        // is called when clock runs out
        if (ticker) {
            ticker.stop();
        }

        // call onComplete method
        setup.callback.onComplete();

    });

    // set default values if missing
    setDefaultsForSoonElement(element);

    // create presenter
    var presenter = createPresenter(element,outline);

    // create the ticker
    ticker = createTicker(element,presenter,rate,options);

    // return
    return ticker;
};